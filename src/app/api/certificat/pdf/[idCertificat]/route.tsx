import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import ReactPDF from '@react-pdf/renderer'

import { getMairie } from '@/lib/api-etablissement-public'
import { CertificatNumerotation } from '@/app/api/certificat/[idAdresse]/components/certificat'

const NEXT_PUBLIC_ADRESSE_URL = process.env.NEXT_PUBLIC_ADRESSE_URL
const NEXT_PUBLIC_API_BAN_URL = process.env.NEXT_PUBLIC_API_BAN_URL

export async function GET(request: NextRequest, { params }: { params: { idCertificat: string } }) {
  const response = await fetch(`${NEXT_PUBLIC_API_BAN_URL}/api/certificate/${params.idCertificat}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    console.error(`Erreur lors de la récupération du certificat : ${response.status} ${response.statusText}`)
    return new NextResponse('Erreur lors de la récupération du certificat', { status: response.status })
  }

  const data = await response.json()
  const certificatUrl = `${NEXT_PUBLIC_ADRESSE_URL}/certificat/${data.id}`
  const qrCodeDataURL = await QRCode.toDataURL(certificatUrl)

  const mairie = await getMairie(data.full_address.cog)
  const mairieData = mairie || { telephone: undefined, email: undefined }

  const pdfStream = await ReactPDF.renderToStream(
    <CertificatNumerotation
      data={data}
      qrCodeDataURL={qrCodeDataURL}
      mairie={mairieData}
    />
  )

  const chunks: Buffer[] = []
  pdfStream.on('data', (chunk) => {
    chunks.push(chunk)
  })

  return new Promise<NextResponse>((resolve, reject) => {
    pdfStream.on('end', () => {
      const buffer = Buffer.concat(chunks as unknown as Uint8Array[])
      const headers = new Headers({ 'Content-Type': 'application/pdf' })
      resolve(new NextResponse(buffer, { headers }))
    })

    pdfStream.on('error', (error) => {
      reject(new Error('Erreur lors de la création du PDF: ' + error.message))
    })
  })
}