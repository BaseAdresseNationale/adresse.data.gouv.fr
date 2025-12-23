import { NextRequest, NextResponse } from 'next/server'
import { getAuthorizationControllerFactory } from '@/utils/oauth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const customParams = body['custom-params']
    return getAuthorizationControllerFactory(customParams)
  }
  catch (error) {
    return NextResponse.json({ error: `Failed to initiate custom connection ${error}` }, { status: 500 })
  }
}
