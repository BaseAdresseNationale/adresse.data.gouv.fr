import { env } from 'next-runtime-env'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { type BANConfig } from '@/types/api-ban.types'

const BAN_API_TOKEN = env('BAN_API_TOKEN')
const NEXT_PUBLIC_API_BAN_URL = env('NEXT_PUBLIC_API_BAN_URL')
const NEXT_PUBLIC_API_GEO_URL = env('NEXT_PUBLIC_API_GEO_URL')
const DEFAULT_CODE_LANGUAGE = 'fra'

type CachedOwnership = { siren: string, expiresAt: number }
// Cache in-memory : non partagé entre instances serverless, mais suffisant pour limiter les appels upstream répétés sur une même instance.
const ownershipCache = new Map<string, CachedOwnership>()
const OWNERSHIP_CACHE_TTL_MS = 5 * 60 * 1000

function getCachedSirenForDistrict(districtID: string): string | null {
  const entry = ownershipCache.get(districtID)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    ownershipCache.delete(districtID)
    return null
  }
  return entry.siren
}

function setCachedSirenForDistrict(districtID: string, siren: string) {
  ownershipCache.set(districtID, { siren, expiresAt: Date.now() + OWNERSHIP_CACHE_TTL_MS })
}

function isUpstreamServerError(status: number): boolean {
  return status >= 500
}

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
    catch (error) {
      console.error('Invalid userinfo cookie format:', error)
      return NextResponse.json({ error: 'Invalid session data' }, { status: 401 })
    }

    if (!user?.sub) {
      return NextResponse.json({ error: 'Invalid user data' }, { status: 401 })
    }

    const userSiret = typeof user?.siret === 'string' ? user.siret : ''
    const userSiren = userSiret.length >= 9 ? userSiret.slice(0, 9) : ''
    if (!userSiren || userSiren.length !== 9) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json() as {
      districtID: string
      config: Partial<BANConfig>
      originalConfig?: Partial<BANConfig>
    }
    const { districtID, config, originalConfig } = body

    if (!districtID || !config) {
      return NextResponse.json(
        { error: 'Missing districtID or config' },
        { status: 400 }
      )
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (typeof districtID !== 'string' || !uuidRegex.test(districtID)) {
      return NextResponse.json(
        { error: 'Invalid districtID format' },
        { status: 400 }
      )
    }

    if (typeof config !== 'object' || config === null || Array.isArray(config)) {
      return NextResponse.json(
        { error: 'Invalid config format' },
        { status: 400 }
      )
    }

    // Contrôle serveur: on vérifie que le district appartient bien à la commune (SIREN) de l'utilisateur
    // NB: les UUID de district ne sont pas résolus via /lookup ; on utilise /api/district/:id.
    // On renvoie 403 (plutôt que 404) pour limiter l'énumération d'UUID valides.
    const districtSiren = getCachedSirenForDistrict(districtID)
    if (!districtSiren) {
      let districtRes: Response
      try {
        districtRes = await fetch(`${NEXT_PUBLIC_API_BAN_URL}/api/district/${districtID}`, {
          method: 'GET',
          cache: 'no-store',
        })
      }
      catch (error) {
        console.error('District lookup upstream error:', error)
        return NextResponse.json({ error: 'Unable to validate commune ownership' }, { status: 502 })
      }

      if (!districtRes.ok) {
        if (isUpstreamServerError(districtRes.status)) {
          return NextResponse.json({ error: 'Unable to validate commune ownership' }, { status: 502 })
        }
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      const districtData: any = await districtRes.json().catch(() => null)
      const codeCommune = (
        (typeof districtData?.response?.meta?.insee?.cog === 'string' && districtData.response.meta.insee.cog)
        || (typeof districtData?.meta?.insee?.cog === 'string' && districtData.meta.insee.cog)
        || null
      )
      if (!codeCommune) {
        return NextResponse.json({ error: 'Unable to validate commune ownership' }, { status: 502 })
      }

      let geoRes: Response
      try {
        geoRes = await fetch(`${NEXT_PUBLIC_API_GEO_URL}/communes/${codeCommune}`, {
          method: 'GET',
          cache: 'no-store',
        })
      }
      catch (error) {
        console.error('Geo commune lookup upstream error:', error)
        return NextResponse.json({ error: 'Unable to validate commune ownership' }, { status: 502 })
      }

      if (!geoRes.ok) {
        return NextResponse.json({ error: 'Unable to validate commune ownership' }, { status: 502 })
      }

      const geoData: any = await geoRes.json().catch(() => null)
      const resolvedSiren = typeof geoData?.siren === 'string' ? geoData.siren : ''
      if (!resolvedSiren) {
        return NextResponse.json({ error: 'Unable to validate commune ownership' }, { status: 502 })
      }
      setCachedSirenForDistrict(districtID, resolvedSiren)

      if (resolvedSiren !== userSiren) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }
    else if (districtSiren !== userSiren) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const changedConfig: Record<string, any> = {}

    const setIfChanged = (key: string, nextValue: any, prevValue: any) => {
      if (nextValue === undefined) return
      if (nextValue !== prevValue) changedConfig[key] = nextValue
    }

    setIfChanged('certificate', config.certificate, originalConfig?.certificate)

    const normalizedOriginal = originalConfig?.defaultBalLang || DEFAULT_CODE_LANGUAGE
    const normalizedNew = config.defaultBalLang || DEFAULT_CODE_LANGUAGE

    if (normalizedNew !== normalizedOriginal) {
      if (normalizedNew === DEFAULT_CODE_LANGUAGE) {
        changedConfig.defaultBalLang = null
      }
      else {
        changedConfig.defaultBalLang = normalizedNew
      }
    }

    setIfChanged('autoFixLabels', config.autoFixLabels, originalConfig?.autoFixLabels)

    setIfChanged('computOldDistrict', config.computOldDistrict, originalConfig?.computOldDistrict)

    setIfChanged('computInteropKey', config.computInteropKey, originalConfig?.computInteropKey)

    setIfChanged('mandatary', config.mandatary, originalConfig?.mandatary)

    if (Object.keys(changedConfig).length === 0) {
      return NextResponse.json({
        message: 'No changes detected',
        success: true,
      }, { status: 200 })
    }

    const validCertificates = ['ALL', 'DISTRICT', 'DISABLED']
    if (changedConfig.certificate !== undefined && !validCertificates.includes(changedConfig.certificate)) {
      return NextResponse.json(
        { error: 'Invalid certificate value' },
        { status: 400 }
      )
    }

    if (changedConfig.defaultBalLang !== undefined && changedConfig.defaultBalLang !== null && typeof changedConfig.defaultBalLang !== 'string') {
      return NextResponse.json(
        { error: 'Invalid defaultBalLang format' },
        { status: 400 }
      )
    }

    if (changedConfig.defaultBalLang !== undefined && changedConfig.defaultBalLang !== null && changedConfig.defaultBalLang.length !== 3) {
      return NextResponse.json(
        { error: 'defaultBalLang must be exactly 3 characters (ISO 639-3 code)' },
        { status: 400 }
      )
    }

    if (changedConfig.autoFixLabels !== undefined && typeof changedConfig.autoFixLabels !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid autoFixLabels format' },
        { status: 400 }
      )
    }

    if (changedConfig.computOldDistrict !== undefined && typeof changedConfig.computOldDistrict !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid computOldDistrict format' },
        { status: 400 }
      )
    }

    if (changedConfig.computInteropKey !== undefined && typeof changedConfig.computInteropKey !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid computInteropKey format' },
        { status: 400 }
      )
    }

    if (changedConfig.mandatary !== undefined && changedConfig.mandatary !== null) {
      if (typeof changedConfig.mandatary !== 'string') {
        return NextResponse.json(
          { error: 'Invalid mandatary format' },
          { status: 400 }
        )
      }
      if (changedConfig.mandatary.trim() === '') {
        return NextResponse.json(
          { error: 'Invalid mandatary identifier' },
          { status: 400 }
        )
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

    const backendBody = {
      districtID,
      config: changedConfig,
      siren: userSiren,
      ...sessionData,
    }

    const response = await fetch(`${NEXT_PUBLIC_API_BAN_URL}/api/district/addressing-certification/enable`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${BAN_API_TOKEN}`,
      },
      body: JSON.stringify(backendBody),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Backend PATCH error:', data)
      return NextResponse.json(
        { error: 'Failed to update district config', details: data },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: response.status })
  }
  catch (error) {
    console.error('Error in /api/addressing-certification-enable:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
