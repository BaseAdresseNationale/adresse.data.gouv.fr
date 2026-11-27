import assert from 'node:assert/strict'
import test from 'node:test'
import nextServer from 'next/server.js'
import { loadTsModule } from '../../../test-utils/load-ts-module.mjs'
import { loadIdentityModule, sealAgent } from '../../../test-utils/auth-modules.mjs'

const SESSION_ID = 'S'.repeat(43)
const IDENTITY = { sub: 'agent-sub', email: 'agent@thourotte.fr', siret: '21600627000019' }

const loadMe = cookieValue => loadTsModule({
  url: new URL('./route.ts', import.meta.url),
  imports: { 'next/server': nextServer, '@/lib/identity': loadIdentityModule({ cookieValue }) },
})

test('the browser gets the display identity, never the session id', async () => {
  const response = await loadMe(await sealAgent({ sessionId: SESSION_ID, identity: IDENTITY })).GET()
  const text = await response.text()

  assert.equal(response.status, 200)
  assert.deepEqual(JSON.parse(text), IDENTITY)
  assert.equal(text.includes(SESSION_ID), false)
})

test('without a session cookie the answer is 401', async () => {
  assert.equal((await loadMe(undefined).GET()).status, 401)
})
