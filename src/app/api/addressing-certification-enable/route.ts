import { env } from 'next-runtime-env'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BAN_API_TOKEN = env('BAN_API_TOKEN')
const NEXT_PUBLIC_API_BAN_URL = env('NEXT_PUBLIC_API_BAN_URL')
const DEFAULT_CODE_LANGUAGE = 'fra'

export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json()
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

    const changedConfig: Record<string, any> = {}

    if (config.certificate !== originalConfig?.certificate) {
      changedConfig.certificate = config.certificate
    }

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

    if (config.autoFixLabels !== originalConfig?.autoFixLabels) {
      changedConfig.autoFixLabels = config.autoFixLabels
    }

    if (config.computOldDistrict !== originalConfig?.computOldDistrict) {
      changedConfig.computOldDistrict = config.computOldDistrict
    }

    if (config.computInteropKey !== originalConfig?.computInteropKey) {
      changedConfig.computInteropKey = config.computInteropKey
    }

    if (config.mandatary !== originalConfig?.mandatary) {
      changedConfig.mandatary = config.mandatary
    }

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

    if (changedConfig.mandatary !== undefined && changedConfig.mandatary !== null && typeof changedConfig.mandatary !== 'string') {
      return NextResponse.json(
        { error: 'Invalid mandatary format' },
        { status: 400 }
      )
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
      siren: user.siret?.substring(0, 9),
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
