import * as client from 'openid-client'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { isObject, mapValues, omitBy } from 'lodash'

// import secureSetup from '@/utils/secure'
// import { env } from 'next-runtime-env'
// const NEXT_PUBLIC_ADRESSE_URL = env('NEXT_PUBLIC_ADRESSE_URL')

export const objToUrlParams = (obj: any) => {
  const processedObj = mapValues(
    omitBy(obj, v => !v),
    o => (isObject(o) ? JSON.stringify(o) : o)
  )

  return new URLSearchParams(processedObj)
}

// export const objToUrlParams = (obj: any) =>
//   new URLSearchParams(
//     chain(obj)
//       .omitBy(v => !v)
//       .mapValues(o => (isObject(o) ? JSON.stringify(o) : o))
//       .value()
//   )

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

export const getAuthorizationControllerFactory = async (req: NextRequest, extraParams?: any) => {
  try {
    const config = await getProviderConfig()
    const nonce = client.randomNonce()
    const state = client.randomState()

    const cookieStore = cookies()
    // cookieStore.set('nonce', nonce, { httpOnly: true, secure: secureSetup, domain: NEXT_PUBLIC_ADRESSE_URL, sameSite: 'strict' })
    // cookieStore.set('state', state, { httpOnly: true, secure: secureSetup, domain: NEXT_PUBLIC_ADRESSE_URL, sameSite: 'strict' })
    cookieStore.set('nonce', nonce, { httpOnly: true })
    cookieStore.set('state', state, { httpOnly: true })

    const redirectUrl = client.buildAuthorizationUrl(
      config,
      objToUrlParams({
        nonce,
        state,
        ...AUTHORIZATION_DEFAULT_PARAMS,
        ...extraParams,
      })
    )
    console.log('authorize', redirectUrl)

    // avoid relative path, https://nextjs.org/docs/messages/middleware-relative-urls
    // const url = req.nextUrl.clone()
    // url.pathname = redirectUrl.pathname
    return NextResponse.redirect(redirectUrl)
  }
  catch (e) {
    console.error(e)
    return NextResponse.json(e)
  }
}
