import { NextRequest, NextResponse } from 'next/server'
import { env } from 'next-runtime-env'
import { cookies } from 'next/headers'

const BAN_API_TOKEN = env('BAN_API_TOKEN')
const NEXT_PUBLIC_API_BAN_URL = env('NEXT_PUBLIC_API_BAN_URL')

export async function GET(request: NextRequest) {
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

    const response = await fetch(`${NEXT_PUBLIC_API_BAN_URL}/api/user-preferences/favorites/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${BAN_API_TOKEN}`,
      },
      body: JSON.stringify(sessionData),
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ favorites: [] }, { status: 200 })
      }

      const errorData = await response.json()
      console.error('BAN API favorites GET error:', errorData)
      return NextResponse.json(
        { error: 'Failed to fetch favorites', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data.response || data, { status: 200 })
  }
  catch (error) {
    console.error('Error in GET /api/favorites:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

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

    const { codeCommune } = body

    if (!codeCommune) {
      return NextResponse.json(
        { error: 'Missing required field: codeCommune' },
        { status: 400 }
      )
    }

    const codeCommuneRegex = /^\d{5}$/
    if (typeof codeCommune !== 'string' || !codeCommuneRegex.test(codeCommune)) {
      return NextResponse.json(
        { error: 'Invalid codeCommune format (must be 5 digits)' },
        { status: 400 }
      )
    }

    const banCommune = await fetch(`${process.env.NEXT_PUBLIC_API_BAN_URL}/lookup/${encodeURIComponent(codeCommune)}`, {
      cache: 'no-store',
    }).then(r => r.json())

    if (!banCommune || !banCommune.banId) {
      return NextResponse.json(
        { error: 'District not found for this codeCommune' },
        { status: 404 }
      )
    }

    const requestBody = {
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
      districtID: banCommune.banId,
    }

    const response = await fetch(`${NEXT_PUBLIC_API_BAN_URL}/api/user-preferences/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${BAN_API_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('BAN API favorites POST error:', errorData)
      return NextResponse.json(
        { error: 'Failed to add favorite', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data.response || data, { status: 201 })
  }
  catch (error) {
    console.error('Error in POST /api/favorites:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
