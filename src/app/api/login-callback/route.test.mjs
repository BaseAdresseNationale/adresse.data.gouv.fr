import assert from 'node:assert/strict'
import test from 'node:test'
import nextServer from 'next/server.js'
import { loadTsModule } from '../../../test-utils/load-ts-module.mjs'
import {
  SITE,
  assertErased,
  cookieValue,
  envModule,
  loadAuthCookiesModule,
  loadIdentityModule,
  loadUrlModule,
  setCookiesByName,
} from '../../../test-utils/auth-modules.mjs'

const NOW = Math.floor(Date.now() / 1000)
const USERINFO = {
  sub: 'agent-sub',
  email: 'agent@thourotte.fr',
  siret: '21600627000019',
  aud: 'client-id',
  iss: 'https://proconnect.example',
  exp: NOW + 60,
  iat: NOW,
  email_verified: true,
}

function loadCallback() {
  const grants = []
  const banSessions = []
  const route = loadTsModule({
    url: new URL('./route.ts', import.meta.url),
    imports: {
      'openid-client': {
        authorizationCodeGrant: async (_config, _url, checks) => {
          grants.push(checks)
          return { claims: () => ({ sub: USERINFO.sub, exp: NOW + 60 }), id_token: 'id-token', access_token: 'access-token' }
        },
        fetchUserInfo: async () => USERINFO,
      },
      'next/server': nextServer,
      '@/utils/oauth': { configOptions: undefined, getProviderConfig: async () => ({}), getCurrentUrl: req => new URL(req.url) },
      '@/lib/api-insee-sirene': { getOrganizationName: async () => 'Commune de Thourotte' },
      '@/lib/ban-session': {
        createBanSession: async (identity) => {
          banSessions.push(identity)
          return { ok: true, status: 201 }
        },
      },
      '@/lib/identity': loadIdentityModule(),
      '@/lib/auth-cookies': loadAuthCookiesModule(),
      '@/utils/env': envModule(),
      '@/utils/url': loadUrlModule(),
    },
  })
  return { route, grants, banSessions }
}

const callback = ({ returnTo }) => {
  const { route, grants, banSessions } = loadCallback()
  const cookie = ['nonce=nonce-value', 'state=state-value', ...(returnTo ? [`auth_return_to=${encodeURIComponent(returnTo)}`] : [])].join('; ')
  return route.GET(new nextServer.NextRequest(`${SITE}/api/login-callback?code=code&state=state-value`, { headers: { cookie } }))
    .then(response => ({ response, grants, banSessions }))
}

test('the callback seals the identity in a cookie that expires with the API session', async () => {
  const { response, grants, banSessions } = await callback({ returnTo: '/commune/60636' })
  const byName = setCookiesByName(response)
  const sealed = byName.ban_identity.at(-1)
  const maxAge = Number(sealed.match(/Max-Age=(\d+)/)[1])
  const identity = JSON.parse(JSON.stringify(await loadIdentityModule().readIdentity(cookieValue(sealed))))

  assert.equal(response.headers.get('location'), `${SITE}/commune/60636`)
  assert.deepEqual(JSON.parse(JSON.stringify(grants)), [{ expectedNonce: 'nonce-value', expectedState: 'state-value' }])
  assert.ok(Math.abs(maxAge - (60 + 6 * 3600)) <= 5, String(maxAge))
  assert.match(sealed, /HttpOnly/)
  assert.doesNotMatch(sealed, /Domain=/)
  assert.equal(identity.sub, 'agent-sub')
  assert.equal(identity.siret, '21600627000019')
  assert.deepEqual(identity.organization, { name: 'Commune de Thourotte' })
  assert.equal('email_verified' in identity, false)
  assert.deepEqual(JSON.parse(JSON.stringify(banSessions)), [identity])
  assert.equal(cookieValue(byName.ban_connected.at(-1)), 'true')
  assert.doesNotMatch(byName.ban_connected.at(-1), /HttpOnly/)
  for (const name of ['nonce', 'state', 'auth_return_to', 'userinfo', 'idtoken', 'oauth2token']) {
    assertErased({ byName, name })
  }
})

test('a return path cookie pointing outside the site sends the agent to the home page', async () => {
  for (const returnTo of ['//faux.example', 'https://faux.example']) {
    const { response } = await callback({ returnTo })
    assert.equal(response.headers.get('location'), `${SITE}/`, returnTo)
  }
})
