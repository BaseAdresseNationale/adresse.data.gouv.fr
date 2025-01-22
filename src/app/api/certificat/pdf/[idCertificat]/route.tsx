import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import ReactPDF from '@react-pdf/renderer'
import { join } from 'node:path'
import * as fs from 'node:fs'

import { getMairie } from '@/lib/api-etablissement-public'
import { CertificatNumerotation } from '@/app/api/certificat/[idAdresse]/components/certificat'
import { env } from 'next-runtime-env'
import { getCommuneLogo } from '@/lib/api-wikidata'

const NEXT_PUBLIC_ADRESSE_URL = env('NEXT_PUBLIC_ADRESSE_URL')
const NEXT_PUBLIC_API_BAN_URL = env('NEXT_PUBLIC_API_BAN_URL')

export async function GET(request: NextRequest, { params }: { params: { idCertificat: string } }) {
  const rawResponse = await fetch(`${NEXT_PUBLIC_API_BAN_URL}/api/certificate/${params.idCertificat}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!rawResponse.ok) {
    return new NextResponse('Erreur lors de la récupération du certificat', { status: rawResponse.status })
  }

  const response = await rawResponse.json()
  // temporary check migrating ban api response structure
  // to-do : remove this check after migration
  const data = response.response || response
  const certificatUrl = `${NEXT_PUBLIC_ADRESSE_URL}/certificat/${data.id}`
  const qrCodeDataURL = await QRCode.toDataURL(certificatUrl)

  const mairie = await getMairie(data.full_address.cog)

  const mairieData = mairie || { telephone: undefined, email: undefined }

  // const logoUrl = await getCommuneLogo(data.full_address.cog) || ' '

  // let logoUrl = `${NEXT_PUBLIC_ADRESSE_URL}/logos/certificat/${data.full_address.cog}.png`

  let logoUrl = join(process.cwd(), 'public', 'logos', 'certificat', `${data.full_address.cog}.png`)

  if (!fs.existsSync(logoUrl)) {
    logoUrl = join(process.cwd(), 'public', 'logos', 'certificat', 'default.png')
  }

  const pdfStream = await ReactPDF.renderToStream(
    <CertificatNumerotation
      data={data}
      qrCodeDataURL={qrCodeDataURL}
      mairie={mairieData}
      logoUrl={logoUrl}

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
