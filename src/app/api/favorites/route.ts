import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/utils/env'
import { getCurrentAgent } from '@/lib/identity'
import { banAgentHeaders } from '@/lib/ban-session'
import { rejectCrossSiteRequest } from '@/lib/request-guard'
import { codeCommuneRegex } from '@/utils/string'

const NEXT_PUBLIC_API_BAN_URL = env('NEXT_PUBLIC_API_BAN_URL')

export async function GET() {
  try {
    const agent = await getCurrentAgent()
    if (!agent) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const response = await fetch(`${NEXT_PUBLIC_API_BAN_URL}/api/user-preferences/favorites/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...banAgentHeaders(agent),
      },
      body: JSON.stringify({}),
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
  const rejection = rejectCrossSiteRequest(request)
  if (rejection) return rejection

  try {
    const agent = await getCurrentAgent()
    if (!agent) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    const body = await request.json()

    const { codeCommune } = body

    if (!codeCommune) {
      return NextResponse.json(
        { error: 'Missing required field: codeCommune' },
        { status: 400 }
      )
    }

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
        { error: 'Cette commune n\'existe pas dans la Base Adresse Nationale.' },
        { status: 404 }
      )
    }

    const response = await fetch(`${NEXT_PUBLIC_API_BAN_URL}/api/user-preferences/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...banAgentHeaders(agent),
      },
      body: JSON.stringify({ districtID: banCommune.banId }),
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
