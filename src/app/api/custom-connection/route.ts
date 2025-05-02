import { NextResponse } from 'next/server'
import { getProviderConfig, objToUrlParams, AUTHORIZATION_DEFAULT_PARAMS } from '@/utils/oauth'
import * as client from 'openid-client'

export async function POST(req) {
  try {
    const body = await req.json()
    const customParams = body['custom-params']

    const config = await getProviderConfig()
    const nonce = client.randomNonce()
    const state = client.randomState()

    // Store nonce and state in cookies or session (e.g., using cookies-next or a session library)
    // Example: cookies().set("nonce", nonce); cookies().set("state", state);

    const redirectUrl = client.buildAuthorizationUrl(
      config,
      objToUrlParams({
        nonce,
        state,
        ...AUTHORIZATION_DEFAULT_PARAMS,
        ...customParams,
      })
    )

    return NextResponse.redirect(redirectUrl)
  }
  catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to initiate custom connection' }, { status: 500 })
  }
}
