import assert from 'node:assert/strict'
import test from 'node:test'
import lodash from 'lodash'
import nextServer from 'next/server.js'
import { loadTsModule } from '../test-utils/load-ts-module.mjs'
import {
  SITE,
  cookieValue,
  envModule,
  loadAuthCookiesModule,
  loadIdentityModule,
  loadUrlModule,
  setCookiesByName,
} from '../test-utils/auth-modules.mjs'

const PROVIDER_AUTHORIZE = 'https://proconnect.example/authorize'
const USERINFO_ENDPOINT = 'https://proconnect.example/userinfo'
const JWKS_URI = 'https://proconnect.example/jwks'
const USERINFO_CLAIMS = { sub: 'agent-sub', email: 'agent@thourotte.fr' }
const customFetch = Symbol('customFetch')

// Like openid-client, the userinfo call goes through the configuration's customFetch, then the JWKS when the answer is signed.
async function fetchUserInfo(config, accessToken, expectedSub) {
  assert.equal(accessToken, 'access-token')
  assert.equal(expectedSub, USERINFO_CLAIMS.sub)
  const response = await config[customFetch](USERINFO_ENDPOINT, { method: 'GET', headers: { authorization: `Bearer ${accessToken}` } })
  if (response.headers.get('content-type').startsWith('application/jwt')) {
    await config[customFetch](JWKS_URI, { method: 'GET', headers: {} })
  }
  await response.text()
  return USERINFO_CLAIMS
}

function loadOauth({ secret = 'a'.repeat(32), userinfoAlg = 'RS256', fetch } = {}) {
  const discoveries = []
  const oauth = loadTsModule({
    url: new URL('./oauth.ts', import.meta.url),
    imports: {
      'openid-client': {
        discovery: async () => {
          discoveries.push(true)
          return {}
        },
        randomNonce: () => 'nonce-value',
        randomState: () => 'state-value',
        buildAuthorizationUrl: (_config, params) => new URL(`${PROVIDER_AUTHORIZE}?${params}`),
        allowInsecureRequests: () => {},
        ClientSecretPost: () => ({}),
        customFetch,
        fetchUserInfo,
      },
      'next/server': nextServer,
      lodash,
      '@/lib/auth-cookies': loadAuthCookiesModule(),
      '@/lib/identity': loadIdentityModule({ env: envModule({ SESSION_SECRET: secret }) }),
      '@/utils/url': loadUrlModule(),
    },
    globals: {
      process: { env: { HOST: SITE, CALLBACK_URL: '/api/login-callback', PC_PROVIDER: 'https://proconnect.example', PC_USERINFO_SIGNED_RESPONSE_ALG: userinfoAlg } },
      console: { error() {} },
      fetch,
    },
  })
  return { oauth, discoveries }
}

const login = ({ query = '', ...options } = {}) => {
  const { oauth, discoveries } = loadOauth(options)
  return oauth.getAuthorizationControllerFactory(new nextServer.NextRequest(`${SITE}/api/login?${query}`))
    .then(response => ({ response, discoveries }))
}

test('without a usable SESSION_SECRET the login stops before ProConnect, with an explicit error', async () => {
  for (const secret of ['', 'CeciEstUnFauxSecret']) {
    const { response, discoveries } = await login({ secret })

    assert.equal(response.status, 500)
    assert.match((await response.json()).error, /SESSION_SECRET manquante ou trop courte/)
    assert.deepEqual(response.headers.getSetCookie(), [])
    assert.deepEqual(discoveries, [])
  }
})

test('the login sends the agent to ProConnect and remembers only an internal return path', async () => {
  for (const [returnTo, saved] of [['/commune/60636?tab=adresses', '/commune/60636?tab=adresses'], ['//faux.example', '/'], ['https://faux.example', '/']]) {
    const { response } = await login({ query: `return_to=${encodeURIComponent(returnTo)}` })
    const byName = setCookiesByName(response)

    assert.ok(response.headers.get('location').startsWith(PROVIDER_AUTHORIZE), returnTo)
    assert.equal(cookieValue(byName.auth_return_to.at(-1)), saved, returnTo)
    assert.equal(cookieValue(byName.nonce.at(-1)), 'nonce-value')
    assert.equal(cookieValue(byName.state.at(-1)), 'state-value')
    for (const name of ['nonce', 'state', 'auth_return_to']) {
      assert.doesNotMatch(byName[name].at(-1), /Domain=/, name)
    }
  }
})

test('without PC_USERINFO_SIGNED_RESPONSE_ALG the login stops before ProConnect', async () => {
  for (const userinfoAlg of ['', null]) {
    const { response, discoveries } = await login({ userinfoAlg })

    assert.equal(response.status, 500)
    assert.match((await response.json()).error, /PC_USERINFO_SIGNED_RESPONSE_ALG manquante/)
    assert.deepEqual(response.headers.getSetCookie(), [])
    assert.deepEqual(discoveries, [])
  }
})

const providerConfig = () => ({ serverMetadata: () => ({ userinfo_endpoint: USERINFO_ENDPOINT }) })

const providerFetch = userinfoResponse => async (url) => {
  if (url === USERINFO_ENDPOINT) return userinfoResponse()
  assert.equal(url, JWKS_URI)
  return Response.json({ keys: [] })
}

test('the signed userinfo is kept raw while openid-client still checks it', async () => {
  for (const contentType of ['application/jwt', 'application/jwt; charset=utf-8']) {
    const { oauth } = loadOauth({ fetch: providerFetch(() => new Response('header.payload.signature', { headers: { 'content-type': contentType } })) })

    const { userinfo, jwt } = await oauth.fetchSignedUserinfo({ config: providerConfig(), accessToken: 'access-token', expectedSub: 'agent-sub' })

    assert.equal(jwt, 'header.payload.signature', contentType)
    assert.deepEqual(userinfo, USERINFO_CLAIMS)
  }
})

test('a JSON userinfo is refused', async () => {
  const { oauth } = loadOauth({ fetch: providerFetch(() => Response.json(USERINFO_CLAIMS)) })

  await assert.rejects(
    oauth.fetchSignedUserinfo({ config: providerConfig(), accessToken: 'access-token', expectedSub: 'agent-sub' }),
    { message: /non signée/ },
  )
})
