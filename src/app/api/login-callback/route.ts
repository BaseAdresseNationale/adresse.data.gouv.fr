import * as client from 'openid-client'
import { NextRequest, NextResponse } from 'next/server'
import { configOptions, getProviderConfig, getCurrentUrl } from '@/utils/oauth'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

import secureSetup from '@/utils/secure'
import { env } from 'next-runtime-env'
const NEXT_PUBLIC_ADRESSE_URL = env('NEXT_PUBLIC_ADRESSE_URL')

export async function GET(req: NextRequest) {
  console.log('login call back started')
  // eslint-disable-next-line
  const hostname = new URL(`${NEXT_PUBLIC_ADRESSE_URL}`).hostname
  console.log('login hostname')
  try {
    console.log('login call back before config')
    const config = await getProviderConfig()
    console.log('login call back after config')
    const currentUrl = getCurrentUrl(req)
    console.log('login call back before cookies')
    const cookieStore = cookies()
    const nonce = cookieStore.get('nonce')
    const state = cookieStore.get('state')
    console.log('login call back after cookies ')
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
    console.log('login call back after grand ')
    cookieStore.delete('nonce')
    cookieStore.delete('state')
    console.log('login call back after delete')
    const claims = tokens.claims()

    if (!claims) throw new Error('Claims are undefined')
    // return NextResponse.json({ error: 'Claims are undefined' })
    const userinfo = await client.fetchUserInfo(
      config,
      tokens.access_token,
      claims.sub,
      configOptions as client.DPoPOptions
    )
    console.log('login call back after user info')
    cookieStore.set('userinfo', JSON.stringify(userinfo), { httpOnly: true, secure: secureSetup, domain: hostname, path: '/', sameSite: 'lax' })
    cookieStore.set('idtoken', JSON.stringify(claims), { httpOnly: true, secure: secureSetup, domain: hostname, path: '/', sameSite: 'lax' })
    cookieStore.set('id_token_hint', JSON.stringify(tokens.id_token), { httpOnly: true, secure: secureSetup, domain: hostname, path: '/', sameSite: 'lax' })
    cookieStore.set('oauth2token', JSON.stringify(tokens), { httpOnly: true, secure: secureSetup, domain: hostname, path: '/', sameSite: 'lax' })
    console.log('login call back after cookies set')
    // avoid relative path, https://nextjs.org/docs/messages/middleware-relative-urls
    const url = req.nextUrl.clone()
    url.pathname = '/'
    console.log('login call back ended')
    return NextResponse.redirect(url)
  }
  catch (error) {
    console.error(error)
    console.log('login call back error')
    // return NextResponse.json({ error: 'Failed to initiate login' })
    return NextResponse.json({ error: 'Callback failed' }, { status: 500 })
  }
}
