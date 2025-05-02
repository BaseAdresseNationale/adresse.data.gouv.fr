import * as client from 'openid-client'
import { chain, isObject } from 'lodash-es'

export const objToUrlParams = obj =>
  new URLSearchParams(
    chain(obj)
      .omitBy(v => !v)
      .mapValues(o => (isObject(o) ? JSON.stringify(o) : o))
      .value()
  )

export const getProviderConfig = async () => {
  const config = await client.discovery(
    new URL(process.env.PC_PROVIDER),
    process.env.PC_CLIENT_ID,
    {
      id_token_signed_response_alg: process.env.PC_ID_TOKEN_SIGNED_RESPONSE_ALG,
      userinfo_signed_response_alg:
        process.env.PC_USERINFO_SIGNED_RESPONSE_ALG || null,
    },
    client.ClientSecretPost(process.env.PC_CLIENT_SECRET),
    process.env.IS_HTTP_PROTOCOL_FORBIDDEN === 'True'
      ? undefined
      : { execute: [client.allowInsecureRequests] }
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
