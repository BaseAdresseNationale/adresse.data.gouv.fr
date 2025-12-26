import { NextRequest, NextResponse } from 'next/server'
import { env } from 'next-runtime-env'

const BAN_API_TOKEN = env('BAN_API_TOKEN')
const NEXT_PUBLIC_API_BAN_URL = env('NEXT_PUBLIC_API_BAN_URL')

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const response = await fetch(`${NEXT_PUBLIC_API_BAN_URL}/api/session`, {
      method: 'POST',
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
    return new Response(JSON.stringify({ error: `Internal Server Error ${error}` }), { status: 500 })
  }
}
