import assert from 'node:assert/strict'
import test from 'node:test'
import nextServer from 'next/server.js'
import { loadTsModule } from '../../../test-utils/load-ts-module.mjs'
import {
  IDENTITY_COOKIES,
  SITE,
  SITE_JSON_HEADERS,
  assertErased,
  cookieValue,
  envModule,
  loadAuthCookiesModule,
  loadBanSessionModule,
  loadIdentityModule,
  loadRequestGuardModule,
  loadUrlModule,
  sealAgent,
  setCookiesByName,
  startSilentApi,
} from '../../../test-utils/auth-modules.mjs'

const API = 'https://api-ban.example'
const PROVIDER_LOGOUT = 'https://proconnect.example/logout'
const SESSION_ID = 'S'.repeat(43)
const env = envModule({ NEXT_PUBLIC_API_BAN_URL: API, BAN_API_TOKEN: 'ban-token' })
const sealed = await sealAgent({ sessionId: SESSION_ID })

function loadLogout({ cookies = {}, providerDown = false, banSession } = {}) {
  const events = []
  const route = loadTsModule({
    url: new URL('./route.ts', import.meta.url),
    imports: {
      'next/server': nextServer,
      'next/headers': { cookies: async () => ({ get: name => (name in cookies ? { value: cookies[name] } : undefined) }) },
      '@/utils/oauth': {
        getProviderConfig: async () => {
          events.push({ step: 'provider' })
          if (providerDown) throw new Error('ProConnect indisponible')
          return {}
        },
        objToUrlParams: params => new URLSearchParams(params),
      },
      'openid-client': { buildEndSessionUrl: (_config, params) => new URL(`${PROVIDER_LOGOUT}?${params}`) },
      '@/utils/env': env,
      '@/utils/sessionExpired': loadTsModule({
        url: new URL('../../../utils/sessionExpired.ts', import.meta.url),
        imports: { '@/utils/logout': { logout: async () => {} } },
      }),
      '@/utils/url': loadUrlModule(),
      '@/lib/identity': loadIdentityModule({ env, cookieValue: cookies.ban_identity }),
      '@/lib/ban-session': banSession ?? loadBanSessionModule({
        env,
        fetch: async (url, init) => {
          events.push({ step: 'revoke', url, method: init.method, headers: { ...init.headers } })
          return new Response(null, { status: 204 })
        },
      }),
      '@/lib/request-guard': loadRequestGuardModule({ nextServer }),
      '@/lib/auth-cookies': loadAuthCookiesModule(),
    },
    globals: { console: { error() {} } },
  })
  return { route, events }
}

const postLogout = ({ body, headers = SITE_JSON_HEADERS, ...options }) => {
  const { route, events } = loadLogout(options)
  return route.POST(new Request(`${SITE}/api/logout`, { method: 'POST', headers, body: JSON.stringify(body ?? {}) }))
    .then(response => ({ response, events }))
}

const getLogout = ({ query = '', ...options }) => {
  const { route, events } = loadLogout(options)
  return route.GET(new Request(`${SITE}/api/logout?${query}`)).then(response => ({ response, events }))
}

test('the logout revokes the API session first, erases every identity cookie and sends the agent to ProConnect', async () => {
  const cases = [
    [{ returnUrl: '/commune/60636' }, '/commune/60636'],
    [{ returnUrl: '/admin', reason: 'session_expired' }, '/admin?reason=session_expired'],
    [{ returnUrl: 'https://faux.example' }, '/'],
    [{ returnUrl: '//faux.example' }, '/'],
    [{}, '/'],
  ]
  for (const [body, returnPath] of cases) {
    const label = JSON.stringify(body)
    const { response, events } = await postLogout({ body, cookies: { ban_identity: sealed, id_token_hint: '"id-token"' } })
    const byName = setCookiesByName(response)
    const { redirectUrl } = await response.json()

    assert.equal(response.status, 200, label)
    assert.deepEqual(events.map(({ step }) => step), ['revoke', 'provider'], label)
    assert.equal(events[0].url, `${API}/api/session`, label)
    assert.equal(events[0].method, 'DELETE', label)
    assert.equal(events[0].headers['X-Ban-Session'], SESSION_ID, label)
    assert.equal(new URL(redirectUrl).origin, new URL(PROVIDER_LOGOUT).origin, label)
    assert.equal(new URL(redirectUrl).searchParams.get('id_token_hint'), 'id-token', label)
    assert.equal(new URL(redirectUrl).searchParams.get('post_logout_redirect_uri'), `${SITE}/api/logout`, label)
    assert.equal(cookieValue(byName.post_logout_return_url.at(-1)), returnPath, label)
    for (const name of IDENTITY_COOKIES) assertErased({ byName, name })
  }
})

test('the identity cookie deletion keeps the attributes it was written with', async () => {
  const { response } = await postLogout({ body: { returnUrl: '/' }, cookies: { ban_identity: sealed } })
  const deletion = setCookiesByName(response).ban_identity.at(-1)
  assert.equal(deletion, 'ban_identity=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; HttpOnly; SameSite=Lax')
})

test('when ProConnect is down, the session is still revoked and the agent stays on the site', async () => {
  for (const [returnUrl, location] of [['/admin', '/admin'], ['//faux.example', '/']]) {
    const { response, events } = await postLogout({ body: { returnUrl }, providerDown: true, cookies: { ban_identity: sealed } })
    const byName = setCookiesByName(response)

    assert.deepEqual(await response.json(), { redirectUrl: location }, returnUrl)
    assert.deepEqual(events.map(({ step }) => step), ['revoke', 'provider'], returnUrl)
    for (const name of IDENTITY_COOKIES) assertErased({ byName, name })
  }
})

test('when the API never answers the revocation, the logout still completes and erases the cookies', { timeout: 10_000 }, async (t) => {
  const silentApi = await startSilentApi()
  t.after(() => silentApi.close())
  const banSession = loadBanSessionModule({ env: envModule({ NEXT_PUBLIC_API_BAN_URL: silentApi.url, BAN_API_TOKEN: 'ban-token' }), fetch })

  const { response } = await postLogout({ body: { returnUrl: '/admin' }, cookies: { ban_identity: sealed }, banSession })
  const byName = setCookiesByName(response)

  assert.equal(response.status, 200)
  assert.deepEqual(silentApi.requests, ['DELETE /api/session'])
  for (const name of IDENTITY_COOKIES) assertErased({ byName, name })
})

test('without a readable session cookie nothing is revoked, but the cookies are still erased', async () => {
  for (const cookies of [{}, { ban_identity: 'illisible' }]) {
    const { response, events } = await postLogout({ body: { returnUrl: '/admin' }, cookies })
    const byName = setCookiesByName(response)

    assert.equal(response.status, 200)
    assert.ok((await response.json()).redirectUrl.startsWith(PROVIDER_LOGOUT))
    assert.deepEqual(events.map(({ step }) => step), ['provider'])
    for (const name of IDENTITY_COOKIES) assertErased({ byName, name })
  }
})

test('a logout from another origin or not in JSON is refused: nothing revoked, nothing erased', async () => {
  const refused = [
    { 'Origin': 'https://evil.example', 'Content-Type': 'application/json' },
    { 'Origin': SITE, 'Content-Type': 'application/x-www-form-urlencoded' },
    { 'Content-Type': 'application/json' },
  ]
  for (const headers of refused) {
    const { response, events } = await postLogout({ headers, cookies: { ban_identity: sealed } })
    assert.equal(response.status, 403, JSON.stringify(headers))
    assert.deepEqual(response.headers.getSetCookie(), [], JSON.stringify(headers))
    assert.deepEqual(events, [], JSON.stringify(headers))
  }
})

test('a GET outside the ProConnect return goes home and touches nothing', async () => {
  for (const query of ['', 'returnUrl=%2Fadmin', 'returnUrl=%2Fadmin&reason=session_expired']) {
    const { response, events } = await getLogout({ query, cookies: { ban_identity: sealed, post_logout_return_url: '/admin' } })

    assert.equal(response.headers.get('location'), `${SITE}/`, query)
    assert.deepEqual(response.headers.getSetCookie(), [], query)
    assert.deepEqual(events, [], query)
  }
})

test('back from ProConnect, the agent returns to the saved path, never outside the site', async () => {
  for (const [saved, location] of [['/commune/60636', `${SITE}/commune/60636`], ['//faux.example', `${SITE}/`]]) {
    const { response, events } = await getLogout({ cookies: { post_logout_return_url: saved, logout_initiated: 'true' } })
    const byName = setCookiesByName(response)

    assert.equal(response.headers.get('location'), location, saved)
    assertErased({ byName, name: 'post_logout_return_url' })
    assertErased({ byName, name: 'logout_initiated' })
    assert.deepEqual(events, [], saved)
  }
})
