import { NextResponse } from 'next/server'
import { getProviderConfig, objToUrlParams } from '@/utils/oauth'
import { cookies } from 'next/headers'
import * as client from 'openid-client'

export async function POST() {
  try {
    const cookieStore = cookies()
    const id_token_hint = cookieStore.get('id_token_hint')?.value
    cookieStore.getAll().forEach((cookie) => {
      cookieStore.delete(cookie.name)
    })
    const config = await getProviderConfig()
    const redirectUrl = client.buildEndSessionUrl(
      config,
      objToUrlParams({
        post_logout_redirect_uri: `${process.env.HOST}/`,
        id_token_hint,
      })
    )

    return NextResponse.redirect(redirectUrl)
  }
  catch (error) {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
