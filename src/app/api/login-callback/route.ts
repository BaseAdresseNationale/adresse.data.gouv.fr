import * as client from 'openid-client'
import { NextRequest, NextResponse } from 'next/server'
import { configOptions, getProviderConfig, getCurrentUrl } from '@/utils/oauth'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const config = await getProviderConfig()
    const currentUrl = getCurrentUrl(req)
    const cookieStore = cookies()
    const nonce = cookieStore.get('nonce')
    const state = cookieStore.get('state')
    const tokens = await client.authorizationCodeGrant(
      config,
      currentUrl,
      {
        expectedNonce: nonce?.value,
        expectedState: state?.value,
      },
      undefined,
      configOptions as client.AuthorizationCodeGrantOptions
    )
    cookieStore.delete('nonce')
    cookieStore.delete('state')
    const claims = tokens.claims()

    if (!claims) throw new Error('Claims are undefined')
    // return NextResponse.json({ error: 'Claims are undefined' })
    const userinfo = await client.fetchUserInfo(
      config,
      tokens.access_token,
      claims.sub,
      configOptions as client.DPoPOptions
    )
    cookieStore.set('userinfo', JSON.stringify(userinfo), { httpOnly: true })
    cookieStore.set('idtoken', JSON.stringify(claims), { httpOnly: true })
    cookieStore.set('id_token_hint', JSON.stringify(tokens.id_token), { httpOnly: true })
    cookieStore.set('oauth2token', JSON.stringify(tokens), { httpOnly: true })

    // avoid relative path, https://nextjs.org/docs/messages/middleware-relative-urls
    const url = req.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }
  catch (error) {
    console.error(error)
    // return NextResponse.json({ error: 'Failed to initiate login' })
    return NextResponse.json({ error: 'Callback failed' }, { status: 500 })
  }
}
