import assert from 'node:assert/strict'
import test from 'node:test'
import nextServer from 'next/server.js'
import { loadTsModule } from '../../../../test-utils/load-ts-module.mjs'
import {
  SITE,
  SITE_JSON_HEADERS,
  envModule,
  loadBanSessionModule,
  loadIdentityModule,
  loadRequestGuardModule,
  loadUrlModule,
  sealAgent,
} from '../../../../test-utils/auth-modules.mjs'

const API = 'https://api-ban.example'
const SESSION_ID = 'S'.repeat(43)
const SUBSCRIPTION_ID = '55c7f562-4f6b-4dac-a685-19efd9afe42c'
const env = envModule({ NEXT_PUBLIC_API_BAN_URL: API, BAN_API_TOKEN: 'ban-token' })
const SESSION_HEADERS = { 'Authorization': 'Token ban-token', 'X-Ban-Session': SESSION_ID }

const sealedAgent = await sealAgent({ sessionId: SESSION_ID })

function loadRoute(cookieValue) {
  const calls = []
  const fetch = async (url, init = {}) => {
    calls.push({ url: String(url), method: init.method ?? 'GET', headers: { ...init.headers }, ...(init.body && { body: JSON.parse(init.body) }) })
    return Response.json({ response: { subscriptions: [], total: 0 } })
  }
  const route = loadTsModule({
    url: new URL('./route.ts', import.meta.url),
    imports: {
      'next/server': nextServer,
      '@/utils/env': env,
      '@/lib/identity': loadIdentityModule({ env, cookieValue }),
      '@/lib/ban-session': loadBanSessionModule({ env, fetch }),
      '@/lib/request-guard': loadRequestGuardModule({ nextServer }),
      '@/utils/url': loadUrlModule(),
      '@/utils/validate': loadTsModule({ url: new URL('../../../../utils/validate.ts', import.meta.url) }),
    },
    globals: { fetch, console: { error() {} } },
  })
  return { route, calls }
}

const request = ({ method, body, headers = SITE_JSON_HEADERS }) => new nextServer.NextRequest(`${SITE}/api/alerts/subscriptions`, {
  method,
  headers,
  ...(body && { body: JSON.stringify(body) }),
})

const NEW_SUBSCRIPTION = {
  webhookURL: 'https://hook.thourotte.fr/ban',
  statusesToFollow: ['error'],
  districtsToFollow: ['60636'],
  allDistricts: false,
}

test('without a valid session cookie every method answers 401 and calls nothing', async () => {
  for (const cookieValue of [undefined, JSON.stringify({ sub: 'autre-agent' })]) {
    const { route, calls } = loadRoute(cookieValue)
    assert.equal((await route.GET()).status, 401)
    assert.equal((await route.POST(request({ method: 'POST', body: NEW_SUBSCRIPTION }))).status, 401)
    assert.equal((await route.PATCH(request({ method: 'PATCH', body: { id: SUBSCRIPTION_ID } }))).status, 401)
    assert.equal((await route.DELETE(request({ method: 'DELETE', body: { id: SUBSCRIPTION_ID } }))).status, 401)
    assert.deepEqual(calls, [])
  }
})

test('a write from another origin or not in JSON answers 403 and calls nothing', async () => {
  const { route, calls } = loadRoute(sealedAgent)
  for (const headers of [{ 'Origin': 'https://evil.example', 'Content-Type': 'application/json' }, { 'Origin': SITE, 'Content-Type': 'text/plain' }]) {
    assert.equal((await route.POST(request({ method: 'POST', body: NEW_SUBSCRIPTION, headers }))).status, 403)
    assert.equal((await route.PATCH(request({ method: 'PATCH', body: { id: SUBSCRIPTION_ID }, headers }))).status, 403)
    assert.equal((await route.DELETE(request({ method: 'DELETE', body: { id: SUBSCRIPTION_ID }, headers }))).status, 403)
  }
  assert.deepEqual(calls, [])
})

test('a subscription id that is not a UUID answers 400 and calls nothing', async () => {
  const { route, calls } = loadRoute(sealedAgent)
  for (const id of ['../../district/x', 42, undefined]) {
    assert.equal((await route.PATCH(request({ method: 'PATCH', body: { id } }))).status, 400, String(id))
    assert.equal((await route.DELETE(request({ method: 'DELETE', body: { id } }))).status, 400, String(id))
  }
  assert.deepEqual(calls, [])
})

test('every call carries the session header and no owner, the API takes it from the session', async () => {
  const { route, calls } = loadRoute(sealedAgent)
  await route.GET()
  await route.POST(request({ method: 'POST', body: { ...NEW_SUBSCRIPTION, createdBy: 'autre-agent', createdByEmail: 'autre@example.fr' } }))
  await route.PATCH(request({ method: 'PATCH', body: { id: SUBSCRIPTION_ID, active: false, createdBy: 'autre-agent' } }))
  await route.DELETE(request({ method: 'DELETE', body: { id: SUBSCRIPTION_ID, createdBy: 'autre-agent' } }))

  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [
    { url: `${API}/api/alerts/subscribers`, method: 'GET', headers: SESSION_HEADERS },
    {
      url: `${API}/api/alerts/subscribers`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...SESSION_HEADERS },
      body: { subscriptionName: null, webhookUrl: NEW_SUBSCRIPTION.webhookURL, statusesToFollow: ['error'], districtsToFollow: ['60636'] },
    },
    {
      url: `${API}/api/alerts/subscription/${SUBSCRIPTION_ID}`,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...SESSION_HEADERS },
      body: { isActive: false },
    },
    { url: `${API}/api/alerts/subscription/${SUBSCRIPTION_ID}`, method: 'DELETE', headers: SESSION_HEADERS },
  ])
})
