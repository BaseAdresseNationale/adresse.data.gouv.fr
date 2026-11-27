import assert from 'node:assert/strict'
import test from 'node:test'
import { envModule, loadBanSessionModule, startSilentApi } from '../test-utils/auth-modules.mjs'

const API = 'https://api.ban.example'
const env = envModule({ NEXT_PUBLIC_API_BAN_URL: API, BAN_API_TOKEN: 'ban-token' })
const SESSION_ID = 'A'.repeat(43)

function loadBanSession(answer) {
  const calls = []
  const api = loadBanSessionModule({
    env,
    fetch: async (url, init) => {
      calls.push({ url, ...init, headers: { ...init.headers } })
      return answer()
    },
  })
  return { api, calls }
}

const envelope = response => Response.json({ date: new Date().toISOString(), status: 'success', message: 'ok', response }, { status: 201 })
const inHours = hours => new Date(Date.now() + hours * 3600 * 1000).toISOString()

test('creating a session sends only the raw ProConnect tokens with the service token', async () => {
  const expiresAt = inHours(12)
  const { api, calls } = loadBanSession(() => envelope({ sessionId: SESSION_ID, expiresAt }))

  const session = await api.createBanSession({ idToken: 'raw.id.token', userinfo: 'raw.userinfo.jwt' })

  assert.equal(session.sessionId, SESSION_ID)
  assert.equal(session.expiresAt.toISOString(), expiresAt)
  assert.equal(calls.length, 1)
  assert.equal(calls[0].url, `${API}/api/session`)
  assert.equal(calls[0].method, 'POST')
  assert.deepEqual(calls[0].headers, { 'Content-Type': 'application/json', 'Authorization': 'Token ban-token' })
  assert.deepEqual(JSON.parse(calls[0].body), { idToken: 'raw.id.token', userinfo: 'raw.userinfo.jwt' })
})

test('a refused, incomplete or already expired session fails the creation', async () => {
  const answers = [
    ['401', () => Response.json({ message: 'refusé' }, { status: 401 })],
    ['400', () => Response.json({ message: 'champ manquant' }, { status: 400 })],
    ['500 without body', () => new Response(null, { status: 500 })],
    ['no sessionId', () => envelope({ expiresAt: inHours(12) })],
    ['sessionId at top level only', () => Response.json({ sessionId: SESSION_ID, expiresAt: inHours(12) }, { status: 201 })],
    ['no expiresAt', () => envelope({ sessionId: SESSION_ID })],
    ['unreadable expiresAt', () => envelope({ sessionId: SESSION_ID, expiresAt: 'demain' })],
    ['past expiresAt', () => envelope({ sessionId: SESSION_ID, expiresAt: inHours(-1) })],
    ['not JSON', () => new Response('<html>', { status: 201 })],
  ]
  for (const [label, answer] of answers) {
    const { api } = loadBanSession(answer)
    await assert.rejects(api.createBanSession({ idToken: 'raw.id.token', userinfo: 'raw.userinfo.jwt' }), { name: 'BanSessionError' }, label)
  }
})

test('creating a session gives up when the API never answers', { timeout: 10_000 }, async (t) => {
  const silentApi = await startSilentApi()
  t.after(() => silentApi.close())
  const api = loadBanSessionModule({ env: envModule({ NEXT_PUBLIC_API_BAN_URL: silentApi.url, BAN_API_TOKEN: 'ban-token' }), fetch })

  await assert.rejects(api.createBanSession({ idToken: 'raw.id.token', userinfo: 'raw.userinfo.jwt' }), { name: 'TimeoutError' })
  assert.deepEqual(silentApi.requests, ['POST /api/session'])
})

test('revoking sends the session header and always resolves', async () => {
  const answers = [
    ['204', () => new Response(null, { status: 204 })],
    ['404', () => new Response(null, { status: 404 })],
    ['500', () => new Response(null, { status: 500 })],
    ['network error', () => {
      throw new TypeError('fetch failed')
    }],
  ]
  for (const [label, answer] of answers) {
    const { api, calls } = loadBanSession(answer)
    await api.revokeBanSession(SESSION_ID)
    assert.equal(calls.length, 1, label)
    assert.equal(calls[0].url, `${API}/api/session`, label)
    assert.equal(calls[0].method, 'DELETE', label)
    assert.deepEqual(calls[0].headers, { 'Authorization': 'Token ban-token', 'X-Ban-Session': SESSION_ID }, label)
  }
})

test('agent headers carry the service token and the session id, nothing else', () => {
  const { api } = loadBanSession(() => new Response(null))
  assert.deepEqual(
    { ...api.banAgentHeaders({ sessionId: SESSION_ID, identity: { sub: 'agent-sub', siret: '21600627000019' } }) },
    { 'Authorization': 'Token ban-token', 'X-Ban-Session': SESSION_ID },
  )
})
