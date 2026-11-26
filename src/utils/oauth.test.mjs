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

function loadOauth({ secret }) {
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
      },
      'next/server': nextServer,
      lodash,
      '@/lib/auth-cookies': loadAuthCookiesModule(),
      '@/lib/identity': loadIdentityModule({ env: envModule({ SESSION_SECRET: secret }) }),
      '@/utils/url': loadUrlModule(),
    },
    globals: { process: { env: { HOST: SITE, CALLBACK_URL: '/api/login-callback', PC_PROVIDER: 'https://proconnect.example' } }, console: { error() {} } },
  })
  return { oauth, discoveries }
}

const login = ({ secret = 'a'.repeat(32), query = '' } = {}) => {
  const { oauth, discoveries } = loadOauth({ secret })
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
