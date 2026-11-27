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
  sealAgent,
} from '../../../../test-utils/auth-modules.mjs'

const API = 'https://api-ban.example'
const SESSION_ID = 'S'.repeat(43)
const ADDRESS_ID = '60636_0010_00001'
const env = envModule({ NEXT_PUBLIC_API_BAN_URL: API, BAN_API_TOKEN: 'ban-token' })
const sealed = await sealAgent({ sessionId: SESSION_ID, identity: { sub: 'agent-sub', siret: '21600627000019' } })

function loadRoute({ cookieValue, certificate = 'DISTRICT' } = {}) {
  const calls = []
  const fetch = async (url, init = {}) => {
    calls.push({ url: String(url), method: init.method, headers: { ...init.headers }, body: JSON.parse(init.body) })
    return Response.json({ response: { id: 'certificate-id' } }, { status: 201 })
  }
  const route = loadTsModule({
    url: new URL('./route.tsx', import.meta.url),
    imports: {
      'next/server': nextServer,
      '@/lib/api-ban': {
        getAddress: async () => ({ banId: 'address-ban-id', codeCommune: '60636', commune: { code: '60636' } }),
        getDistrictConfigByCodeCommune: async () => ({ certificate }),
      },
      '@/lib/api-geo': { getCommune: async () => ({ siren: '216006270' }) },
      '@/lib/ban': { isAddressCertifiable: async () => true },
      '@/utils/env': env,
      '@/types/api-ban.types': { CertificateTypeEnum: { DISTRICT: 'DISTRICT', ALL: 'ALL', DISABLED: 'DISABLED' } },
      '@/lib/identity': loadIdentityModule({ env, cookieValue }),
      '@/lib/ban-session': loadBanSessionModule({ env, fetch }),
      '@/lib/request-guard': loadRequestGuardModule({ nextServer }),
    },
    globals: { fetch, console: { error() {} } },
  })
  return { route, calls }
}

const create = ({ route, headers = SITE_JSON_HEADERS }) => route.POST(
  new nextServer.NextRequest(`${SITE}/api/certificat/${ADDRESS_ID}`, { method: 'POST', headers, body: '{}' }),
  { params: Promise.resolve({ idAdresse: ADDRESS_ID }) },
)

test('a certificate can no longer be created by a GET', () => {
  const { route } = loadRoute({ cookieValue: sealed })
  assert.equal(route.GET, undefined)
  assert.equal(typeof route.POST, 'function')
})

test('a creation from another origin answers 403 and calls nothing', async () => {
  const { route, calls } = loadRoute({ cookieValue: sealed })
  const response = await create({ route, headers: { 'Origin': 'https://evil.example', 'Content-Type': 'application/json' } })
  assert.equal(response.status, 403)
  assert.deepEqual(calls, [])
})

test('a connected agent creates the certificate with the session header and the address only', async () => {
  const { route, calls } = loadRoute({ cookieValue: sealed })
  const response = await create({ route })

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { id: 'certificate-id' })
  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [{
    url: `${API}/api/certificate/`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Token ban-token', 'X-Ban-Session': SESSION_ID },
    body: { addressID: 'address-ban-id' },
  }])
})

test('without an agent, an open certificate is created with the service token only', async () => {
  const { route, calls } = loadRoute({ certificate: 'ALL' })
  assert.equal((await create({ route })).status, 200)
  assert.deepEqual(calls[0].headers, { 'Content-Type': 'application/json', 'Authorization': 'Token ban-token' })
})
