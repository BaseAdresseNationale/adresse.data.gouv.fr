import { NextRequest, NextResponse } from 'next/server'
import { env } from 'next-runtime-env'

const BAN_API_TOKEN = env('BAN_API_TOKEN')
const NEXT_PUBLIC_API_BAN_URL = env('NEXT_PUBLIC_API_BAN_URL')

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.sub) {
      return NextResponse.json(
        { error: 'Missing required field: sub' },
        { status: 400 }
      )
    }

    const sessionPayload = {
      sub: body.sub,
      name: body.name || body.usual_name || body.email,
      givenName: body.given_name,
      familyName: body.family_name,
      usualName: body.usual_name,
      email: body.email,
      siret: body.siret,
      aud: body.aud,
      exp: body.exp,
      iat: body.iat,
      iss: body.iss,
    }

    const response = await fetch(`${NEXT_PUBLIC_API_BAN_URL}/api/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${BAN_API_TOKEN}`,
      },
      body: JSON.stringify(sessionPayload),
    })

    const data = await response.json()

    if (!response.ok && data.message === 'Session already exists') {
      return NextResponse.json({ status: 'success', message: 'Session already exists' }, { status: 200 })
    }

    if (!response.ok) {
      console.error(`BAN API session error (${response.status}):`, data)
      return NextResponse.json(
        { error: 'Failed to create session', details: data },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: response.status })
  }
  catch (error) {
    console.error('Error in /api/proconnect-session:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
