import assert from 'node:assert/strict'
import test from 'node:test'
import nextServer from 'next/server.js'
import { loadTsModule } from '../../../../test-utils/load-ts-module.mjs'
import { SITE, envModule, loadIdentityModule, loadUrlModule } from '../../../../test-utils/auth-modules.mjs'

const API = 'https://api-ban.example'
const SUBSCRIPTION_ID = '55c7f562-4f6b-4dac-a685-19efd9afe42c'
const NOW = Math.floor(Date.now() / 1000)
const env = envModule({ NEXT_PUBLIC_API_BAN_URL: API, BAN_API_TOKEN: 'ban-token' })

const sealedAgent = await loadIdentityModule().sealIdentity({ identity: { sub: 'agent-sub', email: 'agent@thourotte.fr' }, expiresAt: NOW + 3600 })

function loadRoute(cookieValue) {
  const calls = []
  const route = loadTsModule({
    url: new URL('./route.ts', import.meta.url),
    imports: {
      'next/server': nextServer,
      '@/utils/env': env,
      '@/lib/identity': loadIdentityModule({ env, cookieValue }),
      '@/utils/url': loadUrlModule(),
      '@/utils/validate': loadTsModule({ url: new URL('../../../../utils/validate.ts', import.meta.url) }),
    },
    globals: {
      fetch: async (url, init = {}) => {
        calls.push({ url: String(url), method: init.method ?? 'GET', body: init.body && JSON.parse(init.body) })
        return Response.json({ response: { subscriptions: [], total: 0 } })
      },
    },
  })
  return { route, calls }
}

const request = ({ method, body }) => new nextServer.NextRequest(`${SITE}/api/alerts/subscriptions`, {
  method,
  ...(body && { body: JSON.stringify(body) }),
})

test('without a valid identity cookie every method answers 401 and calls nothing', async () => {
  for (const cookieValue of [undefined, JSON.stringify({ sub: 'autre-agent' })]) {
    const { route, calls } = loadRoute(cookieValue)
    assert.equal((await route.GET()).status, 401)
    assert.equal((await route.PATCH(request({ method: 'PATCH', body: { id: SUBSCRIPTION_ID } }))).status, 401)
    assert.equal((await route.DELETE(request({ method: 'DELETE', body: { id: SUBSCRIPTION_ID } }))).status, 401)
    assert.deepEqual(calls, [])
  }
})

test('a subscription id that is not a UUID answers 400 and calls nothing', async () => {
  const { route, calls } = loadRoute(sealedAgent)
  for (const id of ['../../district/x', 42, undefined]) {
    assert.equal((await route.PATCH(request({ method: 'PATCH', body: { id } }))).status, 400, String(id))
    assert.equal((await route.DELETE(request({ method: 'DELETE', body: { id } }))).status, 400, String(id))
  }
  assert.deepEqual(calls, [])
})

test('the owner sent to the API is always the connected agent', async () => {
  const { route, calls } = loadRoute(sealedAgent)
  await route.GET()
  await route.PATCH(request({ method: 'PATCH', body: { id: SUBSCRIPTION_ID, active: false, createdBy: 'autre-agent' } }))
  await route.DELETE(request({ method: 'DELETE', body: { id: SUBSCRIPTION_ID, createdBy: 'autre-agent' } }))

  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [
    { url: `${API}/api/alerts/subscribers?createdBy=agent-sub`, method: 'GET' },
    { url: `${API}/api/alerts/subscription/${SUBSCRIPTION_ID}`, method: 'PATCH', body: { isActive: false, createdBy: 'agent-sub' } },
    { url: `${API}/api/alerts/subscription/${SUBSCRIPTION_ID}`, method: 'DELETE', body: { createdBy: 'agent-sub' } },
  ])
})
