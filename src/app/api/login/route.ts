import { customFetch } from '@/lib/fetch'
import { NextRequest, NextResponse } from 'next/server'
import { env } from 'next-runtime-env'

export const dynamic = 'force-dynamic'

import { getProviderConfig, objToUrlParams, AUTHORIZATION_DEFAULT_PARAMS } from '@/utils/oauth'
import * as client from 'openid-client'

export async function POST() {
  try {
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
      })
    )

    return NextResponse.redirect(redirectUrl)
  }
  catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to initiate login' }, { status: 500 })
  }
}
