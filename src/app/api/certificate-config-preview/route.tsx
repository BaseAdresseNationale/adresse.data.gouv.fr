import { readUserSirenFromCookies } from '@/lib/district-ownership'
import { CertificatNumerotation } from '@/app/api/certificat/[idAdresse]/components/certificat'
import { getMairie } from '@/lib/api-etablissement-public'
import { cookies } from 'next/headers'
import { env } from 'next-runtime-env'
import { NextResponse } from 'next/server'
import QRCode from 'qrcode'
import ReactPDF from '@react-pdf/renderer'

import {
  CERTIFICAT_DEFAULT_LOGO_RELATIVE,
  resolveCertificatCommuneLogoForGeneration,
} from '@/lib/resolve-certificat-commune-logo'
import {
  CERTIFICATE_PREVIEW_CREATED_AT_FOR_LONGEST_DATE,
  normalizedIssuerDetailsForPdf,
  sanitizeCertificateAttestationText,
} from '@/lib/certificate-issuer-config'

const NEXT_PUBLIC_ADRESSE_URL = env('NEXT_PUBLIC_ADRESSE_URL')
const NEXT_PUBLIC_API_GEO_URL = env('NEXT_PUBLIC_API_GEO_URL')

export async function POST(request: Request) {
  try {
    if (!NEXT_PUBLIC_ADRESSE_URL || !NEXT_PUBLIC_API_GEO_URL) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const userSiren = readUserSirenFromCookies(cookies())
    if (!userSiren) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const raw = await request.text()
    if (!raw.trim()) {
      return NextResponse.json({ error: 'Corps de requête vide ou manquant' }, { status: 400 })
    }
    let body: {
      codeCommune: string
      certificateShowLogo?: boolean
      certificateIssuerDetails?: string
      certificateAttestationText?: string
      nomCommune?: string
    }
    try {
      body = JSON.parse(raw) as typeof body
    }
    catch {
      return NextResponse.json({ error: 'Corps JSON invalide ou incomplet' }, { status: 400 })
    }

    const {
      codeCommune,
      certificateShowLogo = false,
      certificateIssuerDetails = '',
      certificateAttestationText = '',
      nomCommune: nomCommuneBody,
    } = body
    if (!codeCommune || typeof codeCommune !== 'string' || !/^\d{5}$/.test(codeCommune)) {
      return NextResponse.json({ error: 'Invalid codeCommune' }, { status: 400 })
    }

    const geoRes = await fetch(`${NEXT_PUBLIC_API_GEO_URL}/communes/${codeCommune}`, { cache: 'no-store' })
    if (!geoRes.ok) {
      return NextResponse.json({ error: 'Unable to validate commune' }, { status: 502 })
    }
    const geoData = await geoRes.json().catch(() => null)
    const communeSiren = typeof geoData?.siren === 'string' ? geoData.siren : ''
    if (!communeSiren || communeSiren !== userSiren) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const nomCommune = nomCommuneBody?.trim()
      || (typeof geoData?.nom === 'string' ? geoData.nom : null)
      || `Commune ${codeCommune}`

    const population
      = typeof geoData?.population === 'number' && Number.isFinite(geoData.population)
        ? geoData.population
        : undefined
    const codesPostaux: string[] = Array.isArray(geoData?.codesPostaux) ? geoData.codesPostaux : []
    const postalCode = codesPostaux[0] || '00000'

    const mairie = await getMairie(codeCommune)
    const mairieData = mairie || { telephone: undefined, email: undefined }

    const logoUrl = certificateShowLogo
      ? await resolveCertificatCommuneLogoForGeneration(codeCommune)
      : CERTIFICAT_DEFAULT_LOGO_RELATIVE

    const previewId = '00000000-0000-4000-8000-000000000001'
    const certificatUrl = `${NEXT_PUBLIC_ADRESSE_URL}/certificat/${previewId}`
    const qrCodeDataURL = await QRCode.toDataURL(certificatUrl)

    const mockData = {
      id: previewId,
      createdAt: CERTIFICATE_PREVIEW_CREATED_AT_FOR_LONGEST_DATE,
      full_address: {
        number: 1,
        commonToponymDefaultLabel: 'Rue de la Mairie',
        districtDefaultLabel: nomCommune,
        cog: codeCommune,
        postalCode,
        multidistributed: false,
      },
      cadastre_ids: ['000AB0001'],
    }

    const issuerDetails = normalizedIssuerDetailsForPdf({ certificateIssuerDetails })

    const pdfStream = await ReactPDF.renderToStream(
      <CertificatNumerotation
        data={mockData}
        qrCodeDataURL={qrCodeDataURL}
        mairie={mairieData}
        logoUrl={logoUrl}
        issuerCustomization={{
          showCommuneLogo: certificateShowLogo,
          issuerDetails,
          attestationText: sanitizeCertificateAttestationText(certificateAttestationText) || undefined,
          population,
        }}
      />,
    )

    const chunks: Buffer[] = []
    pdfStream.on('data', (chunk: Buffer) => {
      chunks.push(chunk)
    })

    return await new Promise<Response>((resolve, reject) => {
      pdfStream.on('end', () => {
        const buffer = Buffer.concat(chunks as unknown as Uint8Array[])
        resolve(
          new NextResponse(buffer, {
            status: 200,
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': 'inline; filename="certificat-adressage-apercu.pdf"',
              'Cache-Control': 'no-store',
            },
          }),
        )
      })
      pdfStream.on('error', (error: Error) => {
        reject(error)
      })
    })
  }
  catch (e) {
    console.error('[certificate-config-preview]', e)
    return NextResponse.json({ error: 'Erreur lors de la génération de l’aperçu' }, { status: 500 })
  }
}
