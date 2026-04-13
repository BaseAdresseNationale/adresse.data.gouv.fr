import { env } from 'next-runtime-env'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { type BANConfig } from '@/types/api-ban.types'
import {
  getCachedCommuneSirenForDistrict,
  readUserSirenFromCookies,
  resolveCommuneSirenForDistrictId,
} from '@/lib/district-ownership'

const BAN_API_TOKEN = env('BAN_API_TOKEN')
const NEXT_PUBLIC_API_BAN_URL = env('NEXT_PUBLIC_API_BAN_URL')
const NEXT_PUBLIC_API_GEO_URL = env('NEXT_PUBLIC_API_GEO_URL')

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(request: NextRequest) {
  try {
    if (!BAN_API_TOKEN || !NEXT_PUBLIC_API_BAN_URL || !NEXT_PUBLIC_API_GEO_URL) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const cookieStore = cookies()
    const userinfo = cookieStore.get('userinfo')
    if (!userinfo) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    let user
    try {
      user = JSON.parse(userinfo.value)
    }
    catch {
      return NextResponse.json({ error: 'Invalid session data' }, { status: 401 })
    }

    if (!user?.sub) {
      return NextResponse.json({ error: 'Invalid user data' }, { status: 401 })
    }

    const userSiren = readUserSirenFromCookies(cookieStore)
    if (!userSiren) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json() as { districtID: string, config: Partial<BANConfig> }
    const { districtID, config } = body

    if (!districtID) {
      return NextResponse.json({ error: 'Missing districtID' }, { status: 400 })
    }

    if (!UUID_REGEX.test(districtID)) {
      return NextResponse.json({ error: 'Invalid districtID format' }, { status: 400 })
    }

    const cachedSiren = getCachedCommuneSirenForDistrict(districtID)
    if (cachedSiren !== null) {
      if (cachedSiren !== userSiren) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }
    else {
      const resolved = await resolveCommuneSirenForDistrictId(
        districtID,
        NEXT_PUBLIC_API_BAN_URL,
        NEXT_PUBLIC_API_GEO_URL,
      )
      if (resolved.status === 'unavailable') {
        return NextResponse.json({ error: 'Unable to validate commune ownership' }, { status: 502 })
      }
      if (resolved.status === 'forbidden') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      if (resolved.siren !== userSiren) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const sessionData = {
      sub: user.sub,
      name: user.name || user.usual_name || user.email,
      givenName: user.given_name,
      familyName: user.family_name,
      usualName: user.usual_name,
      email: user.email,
      siret: user.siret,
      aud: user.aud,
      exp: user.exp,
      iat: user.iat,
      iss: user.iss,
    }

    const response = await fetch(`${NEXT_PUBLIC_API_BAN_URL}/api/district/addressing-certification/enable`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${BAN_API_TOKEN}`,
      },
      body: JSON.stringify({ districtID, config, siren: userSiren, ...sessionData }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.message || 'Failed to update district config' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  }
  catch (error) {
    console.error('Error in /api/addressing-certification-enable:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
