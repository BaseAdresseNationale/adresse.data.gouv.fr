import * as client from 'openid-client'
import { NextRequest, NextResponse } from 'next/server'
import { isObject, mapValues, omitBy } from 'lodash'

import { appendCookie } from '@/lib/auth-cookies'
import { SessionSecretError, getSessionKey } from '@/lib/identity'
import { toInternalPath } from '@/utils/url'

export const objToUrlParams = (obj: any) => {
  const processedObj = mapValues(
    omitBy(obj, v => !v),
    o => (isObject(o) ? JSON.stringify(o) : o)
  )

  return new URLSearchParams(processedObj)
}

export const getCurrentUrl = (req: NextRequest) => {
  const url = new URL(`${req.nextUrl.protocol}//${req.headers.get('host')}${req.nextUrl.pathname}${req.nextUrl.search}`)
  return url
}

export const configOptions
  = process.env.IS_HTTP_PROTOCOL_FORBIDDEN === 'True'
    ? undefined
    : { execute: [client.allowInsecureRequests] }

export const getProviderConfig = async () => {
  const config = await client.discovery(
    new URL(`${process.env.PC_PROVIDER}`),
    `${process.env.PC_CLIENT_ID}`,
    {
      id_token_signed_response_alg: process.env.PC_ID_TOKEN_SIGNED_RESPONSE_ALG,
      userinfo_signed_response_alg: process.env.PC_USERINFO_SIGNED_RESPONSE_ALG || undefined,
    },
    client.ClientSecretPost(process.env.PC_CLIENT_SECRET),
    configOptions
  )
  return config
}

export const AUTHORIZATION_DEFAULT_PARAMS = {
  redirect_uri: `${process.env.HOST}${process.env.CALLBACK_URL}`,
  scope: process.env.PC_SCOPES,
  login_hint: process.env.LOGIN_HINT || null,
  acr_values: process.env.ACR_VALUES ? process.env.ACR_VALUES.split(',') : null,
  claims: {
    id_token: {
      amr: {
        essential: true,
      },
    },
  },
}

export const getAuthorizationControllerFactory = async (req: NextRequest) => {
  try {
    getSessionKey()
  }
  catch (error) {
    if (!(error instanceof SessionSecretError)) throw error
    console.error(error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  try {
    const config = await getProviderConfig()
    const nonce = client.randomNonce()
    const state = client.randomState()
    const returnTo = req.nextUrl.searchParams.get('return_to')

    const redirectUrl = client.buildAuthorizationUrl(
      config,
      objToUrlParams({
        nonce,
        state,
        ...AUTHORIZATION_DEFAULT_PARAMS,
      })
    )

    const response = NextResponse.redirect(redirectUrl)
    const loginCookies = [
      { name: 'nonce', value: nonce },
      { name: 'state', value: state },
      ...(returnTo ? [{ name: 'auth_return_to', value: toInternalPath(returnTo), maxAge: 600 }] : []),
    ]
    for (const cookie of loginCookies) {
      appendCookie({ response, ...cookie, httpOnly: true })
    }
    return response
  }
  catch (e) {
    return NextResponse.json(e)
  }
}
