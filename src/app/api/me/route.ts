import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export function GET() {
  try {
    const cookieStore = cookies()
    const userinfo = cookieStore.get('userinfo')

    if (!userinfo) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    let parsedUser
    try {
      parsedUser = typeof userinfo.value === 'string' ? JSON.parse(userinfo.value) : userinfo.value
    }
    catch (error) {
      console.error('Invalid userinfo cookie format:', error)
      return NextResponse.json({ error: 'Invalid session data' }, { status: 401 })
    }

    if (!parsedUser || (!parsedUser.sub && !parsedUser.id)) {
      return NextResponse.json({ error: 'Invalid user data' }, { status: 401 })
    }

    return NextResponse.json(parsedUser, { status: 200 })
  }
  catch (error) {
    console.error('Error in GET /api/me:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
