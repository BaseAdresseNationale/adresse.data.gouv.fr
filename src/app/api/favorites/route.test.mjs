import assert from 'node:assert/strict'
import test from 'node:test'
import nextServer from 'next/server.js'
import { loadTsModule } from '../../../test-utils/load-ts-module.mjs'
import {
  SITE,
  SITE_JSON_HEADERS,
  envModule,
  loadBanSessionModule,
  loadIdentityModule,
  loadRequestGuardModule,
  sealAgent,
} from '../../../test-utils/auth-modules.mjs'

const API = 'https://api-ban.example'
const SESSION_ID = 'S'.repeat(43)
const DISTRICT_ID = '0a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d'
const env = envModule({ NEXT_PUBLIC_API_BAN_URL: API, BAN_API_TOKEN: 'ban-token' })
const sealed = await sealAgent({ sessionId: SESSION_ID, identity: { sub: 'agent-sub', email: 'agent@thourotte.fr', siret: '21600627000019' } })

function loadRoute({ cookieValue, favoritesStatus = 201 } = {}) {
  const calls = []
  const fetch = async (url, init = {}) => {
    calls.push({ url: String(url), method: init.method ?? 'GET', headers: { ...init.headers }, body: init.body && JSON.parse(init.body) })
    if (String(url).includes('/lookup/')) return Response.json({ banId: DISTRICT_ID })
    return Response.json({ response: { favorites: [] } }, { status: favoritesStatus })
  }
  const route = loadTsModule({
    url: new URL('./route.ts', import.meta.url),
    imports: {
      'next/server': nextServer,
      '@/utils/env': env,
      '@/utils/string': { codeCommuneRegex: /^\d{5}$/ },
      '@/lib/identity': loadIdentityModule({ env, cookieValue }),
      '@/lib/ban-session': loadBanSessionModule({ env, fetch }),
      '@/lib/request-guard': loadRequestGuardModule({ nextServer }),
    },
    globals: { fetch, process: { env: { NEXT_PUBLIC_API_BAN_URL: API } }, console: { error() {} } },
  })
  return { route, calls }
}

const post = ({ headers = SITE_JSON_HEADERS, body = { codeCommune: '60636' } } = {}) =>
  new nextServer.NextRequest(`${SITE}/api/favorites`, { method: 'POST', headers, body: JSON.stringify(body) })

const apiCalls = calls => calls.filter(call => call.url.startsWith(`${API}/api/`))

test('without a session cookie the favorites answer 401 and the API is never called', async () => {
  const { route, calls } = loadRoute()
  assert.equal((await route.GET()).status, 401)
  assert.equal((await route.POST(post())).status, 401)
  assert.deepEqual(calls, [])
})

test('a call from another origin is refused before anything is read or sent', async () => {
  const { route, calls } = loadRoute({ cookieValue: sealed })
  const response = await route.POST(post({ headers: { 'Origin': 'https://evil.example', 'Content-Type': 'application/json' } }))
  assert.equal(response.status, 403)
  assert.deepEqual(calls, [])
})

test('the API receives the session header and only the district, never a claim', async () => {
  const { route, calls } = loadRoute({ cookieValue: sealed })
  assert.equal((await route.GET()).status, 200)
  assert.equal((await route.POST(post({ body: { codeCommune: '60636', sub: 'autre-agent', siret: '00000000000000' } }))).status, 201)

  const [list, add] = apiCalls(calls)
  for (const call of [list, add]) {
    assert.deepEqual(call.headers, { 'Content-Type': 'application/json', 'Authorization': 'Token ban-token', 'X-Ban-Session': SESSION_ID })
  }
  assert.equal(list.url, `${API}/api/user-preferences/favorites/list`)
  assert.deepEqual(list.body, {})
  assert.equal(add.url, `${API}/api/user-preferences/favorites`)
  assert.deepEqual(add.body, { districtID: DISTRICT_ID })
})

test('an expired API session answers 401 to the browser', async () => {
  const { route } = loadRoute({ cookieValue: sealed, favoritesStatus: 401 })
  assert.equal((await route.GET()).status, 401)
  assert.equal((await route.POST(post())).status, 401)
})
