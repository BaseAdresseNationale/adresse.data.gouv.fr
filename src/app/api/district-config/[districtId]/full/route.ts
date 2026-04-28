import {
  readUserSirenFromCookies,
  resolveCommuneSirenForDistrictId,
} from '@/lib/district-ownership'
import { type BANConfig } from '@/types/api-ban.types'
import { cookies } from 'next/headers'
import { env } from 'next-runtime-env'
import { NextRequest, NextResponse } from 'next/server'

const BAN_API_TOKEN = env('BAN_API_TOKEN')
const BAN_URL = env('NEXT_PUBLIC_API_BAN_URL')
const GEO_URL = env('NEXT_PUBLIC_API_GEO_URL')

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(_req: NextRequest, { params }: { params: { districtId: string } }) {
  if (!BAN_API_TOKEN || !BAN_URL) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })

  const { districtId } = params
  if (!UUID_REGEX.test(districtId)) return NextResponse.json({ error: 'Invalid districtId' }, { status: 400 })

  const userSiren = readUserSirenFromCookies(cookies())
  if (!userSiren || !GEO_URL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const resolved = await resolveCommuneSirenForDistrictId(districtId, BAN_URL, GEO_URL)
  if (resolved.status !== 'ok' || resolved.siren !== userSiren) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const res = await fetch(`${BAN_URL}/api/district-config/${districtId}`, {
    headers: { Authorization: `Token ${BAN_API_TOKEN}` },
    cache: 'no-store',
  })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    console.error('[district-config/full] erreur API BAN', { districtId, status: res.status, body: data })
    return NextResponse.json(
      { error: 'Impossible de récupérer la configuration du territoire.' },
      { status: res.status },
    )
  }

  const raw = data?.response ?? data
  const fullConfig = (raw?.config ?? raw) as BANConfig | Record<string, unknown>

  if (!fullConfig || typeof fullConfig !== 'object') {
    return NextResponse.json({ error: 'Invalid config payload' }, { status: 502 })
  }

  return NextResponse.json({ config: fullConfig as BANConfig }, { status: res.status })
}
