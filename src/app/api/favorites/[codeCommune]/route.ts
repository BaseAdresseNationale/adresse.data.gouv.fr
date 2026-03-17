import { NextRequest, NextResponse } from 'next/server'
import { env } from 'next-runtime-env'
import { cookies } from 'next/headers'

const BAN_API_TOKEN = env('BAN_API_TOKEN')
const NEXT_PUBLIC_API_BAN_URL = env('NEXT_PUBLIC_API_BAN_URL')

export async function DELETE(
  request: NextRequest,
  { params }: { params: { codeCommune: string } }
) {
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

    const { codeCommune: districtID } = params

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (typeof districtID !== 'string' || !uuidRegex.test(districtID)) {
      return NextResponse.json(
        { error: 'Invalid districtID format' },
        { status: 400 }
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
      districtID,
    }

    const response = await fetch(
      `${NEXT_PUBLIC_API_BAN_URL}/api/user-preferences/favorites/delete`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${BAN_API_TOKEN}`,
        },
        body: JSON.stringify(requestBody),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('BAN API favorites DELETE error:', errorData)
      return NextResponse.json(
        { error: 'Failed to remove favorite', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data.response || data, { status: 200 })
  }
  catch (error) {
    console.error('Error in DELETE /api/favorites/[districtID]:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
