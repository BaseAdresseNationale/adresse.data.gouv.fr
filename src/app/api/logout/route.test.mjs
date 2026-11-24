import assert from 'node:assert/strict'
import test from 'node:test'
import nextServer from 'next/server.js'
import { loadTsModule } from '../../../test-utils/load-ts-module.mjs'
import {
  IDENTITY_COOKIES,
  SITE,
  assertErased,
  cookieValue,
  envModule,
  loadAuthCookiesModule,
  loadIdentityModule,
  loadUrlModule,
  setCookiesByName,
} from '../../../test-utils/auth-modules.mjs'

const PROVIDER_LOGOUT = 'https://proconnect.example/logout'

function loadLogout({ cookies = {}, providerDown = false } = {}) {
  return loadTsModule({
    url: new URL('./route.ts', import.meta.url),
    imports: {
      'next/server': nextServer,
      'next/headers': { cookies: async () => ({ get: name => (name in cookies ? { value: cookies[name] } : undefined) }) },
      '@/utils/oauth': {
        getProviderConfig: async () => {
          if (providerDown) throw new Error('ProConnect indisponible')
          return {}
        },
        objToUrlParams: params => new URLSearchParams(params),
      },
      'openid-client': { buildEndSessionUrl: (_config, params) => new URL(`${PROVIDER_LOGOUT}?${params}`) },
      '@/utils/env': envModule(),
      '@/utils/sessionExpired': loadTsModule({ url: new URL('../../../utils/sessionExpired.ts', import.meta.url) }),
      '@/utils/url': loadUrlModule(),
      '@/lib/identity': loadIdentityModule(),
      '@/lib/auth-cookies': loadAuthCookiesModule(),
    },
    globals: { console: { error() {} } },
  })
}

const logout = ({ query, ...options }) => loadLogout(options).GET(new Request(`${SITE}/api/logout?${query}`))

test('starting a logout erases every identity cookie and keeps an internal return path', async () => {
  const cases = [
    ['returnUrl=%2Fcommune%2F60636', '/commune/60636'],
    ['returnUrl=%2Fadmin&reason=session_expired', '/admin?reason=session_expired'],
    ['returnUrl=https%3A%2F%2Ffaux.example', '/'],
    ['returnUrl=%2F%2Ffaux.example', '/'],
  ]
  for (const [query, returnPath] of cases) {
    const response = await logout({ query, cookies: { id_token_hint: '"id-token"' } })
    const byName = setCookiesByName(response)

    assert.equal(response.status, 302, query)
    assert.equal(new URL(response.headers.get('location')).searchParams.get('id_token_hint'), 'id-token', query)
    assert.equal(cookieValue(byName.post_logout_return_url.at(-1)), returnPath, query)
    for (const name of IDENTITY_COOKIES) assertErased({ byName, name })
  }
})

test('when ProConnect is down, the logout still erases the identity and stays on the site', async () => {
  for (const [query, location] of [['returnUrl=%2Fadmin', `${SITE}/admin`], ['returnUrl=%2F%2Ffaux.example', `${SITE}/`]]) {
    const response = await logout({ query, providerDown: true })
    const byName = setCookiesByName(response)

    assert.equal(response.headers.get('location'), location, query)
    for (const name of IDENTITY_COOKIES) assertErased({ byName, name })
  }
})

test('back from ProConnect, the agent returns to the saved path, never outside the site', async () => {
  for (const [saved, location] of [['/commune/60636', `${SITE}/commune/60636`], ['//faux.example', `${SITE}/`]]) {
    const response = await logout({ query: '', cookies: { post_logout_return_url: saved, logout_initiated: 'true' } })
    const byName = setCookiesByName(response)

    assert.equal(response.headers.get('location'), location, saved)
    assertErased({ byName, name: 'post_logout_return_url' })
    assertErased({ byName, name: 'logout_initiated' })
  }
})
