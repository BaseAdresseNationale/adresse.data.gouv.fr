import { readUserSirenFromCookies } from '@/lib/district-ownership'
import { getMairie } from '@/lib/api-etablissement-public'
import {
  defaultCertificateIssuerDetailsLines,
  isVilleParPopulation,
  sanitizeCertificateIssuerDetails,
} from '@/lib/certificate-issuer-config'
import { cookies } from 'next/headers'
import { env } from 'next-runtime-env'
import { NextResponse } from 'next/server'

const NEXT_PUBLIC_API_GEO_URL = env('NEXT_PUBLIC_API_GEO_URL')

export async function GET(
  _request: Request,
  context: { params: { codeCommune: string } },
) {
  try {
    if (!NEXT_PUBLIC_API_GEO_URL) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const userSiren = readUserSirenFromCookies(cookies())
    if (!userSiren) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const codeCommune = context.params.codeCommune
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

    const mairie = await getMairie(codeCommune)
    const nomCommune = typeof geoData?.nom === 'string' ? geoData.nom.trim() : ''
    const population
      = typeof geoData?.population === 'number' && Number.isFinite(geoData.population)
        ? geoData.population
        : undefined
    const body = defaultCertificateIssuerDetailsLines(mairie)
    const collectivitePrefix = isVilleParPopulation(population) ? 'Ville' : 'Commune'
    const raw = nomCommune
      ? `${collectivitePrefix} de ${nomCommune}\n${body}`.trim()
      : body
    const certificateIssuerDetails = sanitizeCertificateIssuerDetails(raw)

    return NextResponse.json({ certificateIssuerDetails })
  }
  catch (e) {
    console.error('[certificate-issuer-default-contact]', e)
    return NextResponse.json({ error: 'Erreur lors de la récupération des coordonnées' }, { status: 500 })
  }
}
