import { NextRequest, NextResponse } from 'next/server'
import { createBanSession } from '@/lib/ban-session'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.sub) {
      return NextResponse.json(
        { error: 'Missing required field: sub' },
        { status: 400 }
      )
    }

    const result = await createBanSession(body as Parameters<typeof createBanSession>[0])

    if (result.ok) {
      return NextResponse.json(
        result.data ?? { status: 'success' },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create session', details: result.data },
      { status: result.status }
    )
  }
  catch (error) {
    console.error('[proconnect-session] Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
