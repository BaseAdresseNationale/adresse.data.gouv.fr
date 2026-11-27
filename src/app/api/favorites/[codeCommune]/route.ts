import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/utils/env'
import { getCurrentAgent } from '@/lib/identity'
import { banAgentHeaders } from '@/lib/ban-session'
import { rejectCrossSiteRequest } from '@/lib/request-guard'

const NEXT_PUBLIC_API_BAN_URL = env('NEXT_PUBLIC_API_BAN_URL')

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ codeCommune: string }> }
) {
  const rejection = rejectCrossSiteRequest(request)
  if (rejection) return rejection

  try {
    const agent = await getCurrentAgent()
    if (!agent) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { codeCommune: districtID } = await params

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (typeof districtID !== 'string' || !uuidRegex.test(districtID)) {
      return NextResponse.json(
        { error: 'Invalid districtID format' },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${NEXT_PUBLIC_API_BAN_URL}/api/user-preferences/favorites/delete`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...banAgentHeaders(agent),
        },
        body: JSON.stringify({ districtID }),
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
