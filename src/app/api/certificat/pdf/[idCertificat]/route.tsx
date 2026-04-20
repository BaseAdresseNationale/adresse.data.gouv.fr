import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import ReactPDF from '@react-pdf/renderer'

import { getMairie } from '@/lib/api-etablissement-public'
import { getDistrictConfigByCodeCommune } from '@/lib/api-ban'
import { CertificatNumerotation } from '@/app/api/certificat/[idAdresse]/components/certificat'
import {
  CERTIFICAT_DEFAULT_LOGO_RELATIVE,
  resolveCertificatCommuneLogoForGeneration,
} from '@/lib/resolve-certificat-commune-logo'
import {
  normalizedIssuerDetailsForPdf,
  sanitizeCertificateAttestationText,
} from '@/lib/certificate-issuer-config'
import { env } from 'next-runtime-env'
import { isUUIDv4 } from '@/utils/validate'
const NEXT_PUBLIC_ADRESSE_URL = env('NEXT_PUBLIC_ADRESSE_URL')
const NEXT_PUBLIC_API_BAN_URL = env('NEXT_PUBLIC_API_BAN_URL')

export async function GET(request: NextRequest, { params }: { params: { idCertificat: string } }) {
  if (!isUUIDv4(params.idCertificat)) {
    return new NextResponse('Invalid certificate ID: Must be a valid UUID v4', { status: 400 })
  }

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
  const data = response.response || response
  const certificatUrl = `${NEXT_PUBLIC_ADRESSE_URL}/certificat/${data.id}`
  const qrCodeDataURL = await QRCode.toDataURL(certificatUrl)

  const mairie = await getMairie(data.full_address.cog)

  const mairieData = mairie || { telephone: undefined, email: undefined }

  const districtConfig = await getDistrictConfigByCodeCommune(data.full_address.cog)
  const showCommuneLogo = districtConfig?.certificateShowLogo === true
  const logoUrl = showCommuneLogo
    ? await resolveCertificatCommuneLogoForGeneration(data.full_address.cog)
    : CERTIFICAT_DEFAULT_LOGO_RELATIVE
  const issuerDetails = normalizedIssuerDetailsForPdf(districtConfig ?? {})
  const attestationText = districtConfig?.certificateAttestationText
    ? sanitizeCertificateAttestationText(districtConfig.certificateAttestationText)
    : undefined

  const pdfStream = await ReactPDF.renderToStream(
    <CertificatNumerotation
      data={data}
      qrCodeDataURL={qrCodeDataURL}
      mairie={mairieData}
      logoUrl={logoUrl}
      issuerCustomization={{
        showCommuneLogo,
        issuerDetails,
        attestationText: attestationText || undefined,
      }}
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
