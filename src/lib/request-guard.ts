import { NextResponse } from 'next/server'
import { env } from '@/utils/env'

const JSON_MEDIA_TYPE = 'application/json'

// À appeler en premier dans toute route d'écriture. Le navigateur envoie toujours `Origin` hors GET,
// même vers le même site, et un formulaire HTML ne peut pas poser `application/json`.
export function rejectCrossSiteRequest(request: Request): NextResponse | null {
  const mediaType = request.headers.get('content-type')?.split(';')[0].trim().toLowerCase()
  const origin = request.headers.get('origin')
  const siteOrigin = new URL(`${env('NEXT_PUBLIC_ADRESSE_URL')}`).origin

  if (mediaType === JSON_MEDIA_TYPE && origin === siteOrigin) return null
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
