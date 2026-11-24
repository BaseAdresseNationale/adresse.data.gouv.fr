import { NextResponse } from 'next/server'
import { getCurrentIdentity } from '@/lib/identity'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const identity = await getCurrentIdentity()

    if (!identity) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    return NextResponse.json(identity, { status: 200 })
  }
  catch (error) {
    console.error('Error in GET /api/me:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
