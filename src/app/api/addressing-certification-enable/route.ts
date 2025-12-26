import { env } from 'next-runtime-env'
import { NextRequest, NextResponse } from 'next/server'

const BAN_API_TOKEN = env('BAN_API_TOKEN')
const NEXT_PUBLIC_API_BAN_URL = env('NEXT_PUBLIC_API_BAN_URL')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const response = await fetch(`${NEXT_PUBLIC_API_BAN_URL}/api/district/addressing-certification/enable`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${BAN_API_TOKEN}`,
      },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  }
  catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error ' + error }), { status: 500 })
  }
}
