import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const userinfo = cookieStore.get('userinfo')
  if (!userinfo) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  return NextResponse.json(userinfo.value, { status: 200 })
}
