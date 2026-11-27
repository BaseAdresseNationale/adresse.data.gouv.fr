import assert from 'node:assert/strict'
import test from 'node:test'
import nextServer from 'next/server.js'
import { loadTsModule } from '../../../test-utils/load-ts-module.mjs'
import {
  SITE,
  assertErased,
  cookieValue,
  envModule,
  identityCookieName,
  loadAuthCookiesModule,
  loadBanSessionModule,
  loadIdentityModule,
  loadUrlModule,
  setCookiesByName,
} from '../../../test-utils/auth-modules.mjs'

const API = 'https://api.ban.example'
const env = envModule({ NEXT_PUBLIC_API_BAN_URL: API, BAN_API_TOKEN: 'ban-token' })
const SESSION_ID = 'S'.repeat(43)
const SIGNED_USERINFO = 'signed.userinfo.jwt'
const USERINFO = {
  sub: 'agent-sub',
  email: 'agent@thourotte.fr',
  siret: '21600627000019',
  aud: 'client-id',
  iss: 'https://proconnect.example',
  email_verified: true,
}
const IDENTITY_COOKIES_WRITTEN = ['id_token_hint', 'ban_connected']

const created = expiresAt => () => Response.json({ status: 'success', response: { sessionId: SESSION_ID, expiresAt } }, { status: 201 })
const inHours = hours => new Date(Date.now() + hours * 3600 * 1000).toISOString()

function loadCallback({ secure = false, apiAnswer, unsignedUserinfo = false }) {
  const apiCalls = []
  const route = loadTsModule({
    url: new URL('./route.ts', import.meta.url),
    imports: {
      'openid-client': {
        authorizationCodeGrant: async () => ({ claims: () => ({ sub: USERINFO.sub }), id_token: 'raw.id.token', access_token: 'access-token' }),
      },
      'next/server': nextServer,
      '@/utils/oauth': {
        configOptions: undefined,
        getProviderConfig: async () => ({}),
        getCurrentUrl: req => new URL(req.url),
        fetchSignedUserinfo: async ({ expectedSub }) => {
          assert.equal(expectedSub, USERINFO.sub)
          if (unsignedUserinfo) throw new Error('Réponse userinfo non signée')
          return { userinfo: USERINFO, jwt: SIGNED_USERINFO }
        },
      },
      '@/lib/api-insee-sirene': { getOrganizationName: async () => 'Commune de Thourotte' },
      '@/lib/ban-session': loadBanSessionModule({
        env,
        fetch: async (url, init) => {
          apiCalls.push({ url, ...init })
          return apiAnswer()
        },
      }),
      '@/lib/identity': loadIdentityModule({ secure }),
      '@/lib/auth-cookies': loadAuthCookiesModule({ secure }),
      '@/utils/env': env,
      '@/utils/url': loadUrlModule(),
    },
    globals: { console: { error() {} } },
  })
  return { route, apiCalls }
}

const callback = ({ returnTo, ...options }) => {
  const { route, apiCalls } = loadCallback(options)
  const cookie = ['nonce=nonce-value', 'state=state-value', ...(returnTo ? [`auth_return_to=${encodeURIComponent(returnTo)}`] : [])].join('; ')
  return route.GET(new nextServer.NextRequest(`${SITE}/api/login-callback?code=code&state=state-value`, { headers: { cookie } }))
    .then(response => ({ response, apiCalls }))
}

test('the callback opens an API session with the raw tokens and seals only its id with the display identity', async () => {
  for (const secure of [false, true]) {
    const { response, apiCalls } = await callback({ secure, returnTo: '/commune/60636', apiAnswer: created(inHours(12)) })
    const byName = setCookiesByName(response)
    const sealed = byName[identityCookieName({ secure })].at(-1)
    const maxAge = Number(sealed.match(/Max-Age=(\d+)/)[1])
    const agent = JSON.parse(JSON.stringify(await loadIdentityModule({ secure }).readSession(cookieValue(sealed))))

    assert.equal(response.headers.get('location'), `${SITE}/commune/60636`)
    assert.equal(apiCalls.length, 1)
    assert.equal(apiCalls[0].url, `${API}/api/session`)
    assert.deepEqual(JSON.parse(apiCalls[0].body), { idToken: 'raw.id.token', userinfo: SIGNED_USERINFO })
    assert.ok(Math.abs(maxAge - 12 * 3600) <= 5, String(maxAge))
    assert.match(sealed, /; HttpOnly; SameSite=Lax$/)
    assert.equal(sealed.includes('; Secure;'), secure)
    assert.doesNotMatch(sealed, /Domain=/)
    assert.equal(agent.sessionId, SESSION_ID)
    assert.equal(agent.identity.sub, 'agent-sub')
    assert.equal(agent.identity.siret, '21600627000019')
    assert.deepEqual(agent.identity.organization, { name: 'Commune de Thourotte' })
    for (const field of ['email_verified', 'aud', 'iss']) {
      assert.equal(field in agent.identity, false, field)
    }
    for (const name of IDENTITY_COOKIES_WRITTEN) {
      assert.match(byName[name].at(-1), new RegExp(`; Max-Age=${maxAge};`), name)
    }
    assert.equal(cookieValue(byName.ban_connected.at(-1)), 'true')
    assert.doesNotMatch(byName.ban_connected.at(-1), /HttpOnly/)
    for (const name of ['nonce', 'state', 'auth_return_to', 'userinfo', 'idtoken', 'oauth2token']) {
      assertErased({ byName, name })
    }
  }
})

test('when the API refuses the session, the agent lands on the error page without any identity cookie', async () => {
  const refusals = [
    ['401', () => Response.json({ message: 'refusé' }, { status: 401 })],
    ['500', () => new Response(null, { status: 500 })],
    ['malformed expiresAt', created('demain')],
  ]
  for (const [label, apiAnswer] of refusals) {
    const { response, apiCalls } = await callback({ returnTo: '/commune/60636', apiAnswer })
    const byName = setCookiesByName(response)

    assert.equal(apiCalls.length, 1, label)
    assert.equal(response.headers.get('location'), `${SITE}/connexion/erreur`, label)
    for (const name of ['ban_identity', '__Host-ban_identity', ...IDENTITY_COOKIES_WRITTEN]) {
      assert.equal(byName[name], undefined, `${label} : ${name}`)
    }
    for (const name of ['nonce', 'state', 'auth_return_to']) assertErased({ byName, name })
  }
})

test('an unsigned userinfo stops the login before the API is called', async () => {
  const { response, apiCalls } = await callback({ unsignedUserinfo: true, apiAnswer: created(inHours(12)) })
  const byName = setCookiesByName(response)

  assert.equal(apiCalls.length, 0)
  assert.equal(response.headers.get('location'), `${SITE}/connexion/erreur`)
  for (const name of ['ban_identity', ...IDENTITY_COOKIES_WRITTEN]) {
    assert.equal(byName[name], undefined, name)
  }
  for (const name of ['nonce', 'state']) assertErased({ byName, name })
})

test('a return path cookie pointing outside the site sends the agent to the home page', async () => {
  for (const returnTo of ['//faux.example', 'https://faux.example']) {
    const { response } = await callback({ returnTo, apiAnswer: created(inHours(12)) })
    assert.equal(response.headers.get('location'), `${SITE}/`, returnTo)
  }
})
