import { NextResponse } from 'next/server'
import { getCurrentAgent } from '@/lib/identity'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const agent = await getCurrentAgent()

    if (!agent) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Jamais l'identifiant de session : il ne quitte pas le serveur.
    return NextResponse.json(agent.identity, { status: 200 })
  }
  catch (error) {
    console.error('Error in GET /api/me:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
