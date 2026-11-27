import assert from 'node:assert/strict'
import * as crypto from 'node:crypto'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import * as jose from 'jose'
import ts from 'typescript'

const { outputText } = ts.transpileModule(
  readFileSync(new URL('./identity.ts', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } },
)
const SECRET = 'a'.repeat(32) + '-local-test-secret'
const NOW = Math.floor(Date.now() / 1000)
const inSeconds = seconds => new Date((NOW + seconds) * 1000)

function loadIdentity(options = {}) {
  const { cookieValue, secure = false } = options
  const secret = 'secret' in options ? options.secret : SECRET
  const exports = {}
  const errors = []
  const cookieNames = []
  runInNewContext(outputText, {
    exports,
    require(name) {
      if (name === 'node:crypto') return crypto
      if (name === 'jose') return jose
      if (name === '@/utils/secure') return { __esModule: true, default: secure }
      if (name === 'next/headers') {
        return {
          cookies: async () => ({
            get: (cookieName) => {
              cookieNames.push(cookieName)
              return cookieValue === undefined ? undefined : { value: cookieValue }
            },
          }),
        }
      }
      assert.equal(name, '@/utils/env')
      return { env: key => (key === 'SESSION_SECRET' ? secret : undefined) }
    },
    console: { error: (...args) => errors.push(args) },
  })
  return { api: exports, errors, cookieNames }
}

const plain = value => JSON.parse(JSON.stringify(value))
const identity = { sub: 'agent-sub', email: 'agent@thourotte.fr', siret: '21600627000019' }
const session = { sessionId: 'opaque-session-id', identity }

test('reading refuses an absent, plain, tampered, foreign or expired cookie', async () => {
  const { api } = loadIdentity()
  const valid = await api.sealSession({ ...session, expiresAt: inSeconds(3600) })
  const tampered = valid.slice(0, -4) + (valid.endsWith('AAAA') ? 'BBBB' : 'AAAA')
  const foreign = await loadIdentity({ secret: 'b'.repeat(40) }).api.sealSession({ ...session, expiresAt: inSeconds(3600) })
  const expired = await api.sealSession({ ...session, expiresAt: inSeconds(-10) })
  for (const [label, value] of [['absent', undefined], ['plain', '{"sub":"x"}'], ['tampered', tampered], ['foreign', foreign], ['expired', expired]]) {
    assert.equal(await api.readSession(value), null, label)
  }
})

test('a sealed session reads back with its id and identity, and expires at the API expiry', async () => {
  const { api } = loadIdentity()
  const expiresAt = inSeconds(12 * 3600)
  const sealed = await api.sealSession({ ...session, expiresAt })
  const { cookieNames, api: current } = loadIdentity({ cookieValue: sealed })

  assert.deepEqual(plain(await api.readSession(sealed)), session)
  assert.deepEqual(plain(await current.getCurrentAgent()), session)
  assert.deepEqual(cookieNames, ['ban_identity'])
  assert.equal(jose.decodeProtectedHeader(sealed).enc, 'A256GCM')
  const { payload } = await jose.jwtDecrypt(sealed, crypto.createHash('sha256').update(SECRET).digest())
  assert.equal(payload.exp, NOW + 12 * 3600)
})

test('a cookie of the previous version, without session id, is not an agent', async () => {
  const { api } = loadIdentity()
  const previous = await new jose.EncryptJWT({ identity })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setExpirationTime(NOW + 3600)
    .encrypt(crypto.createHash('sha256').update(SECRET).digest())

  assert.equal(await api.readSession(previous), null)
  for (const sessionId of ['', 42]) {
    assert.equal(await api.readSession(await api.sealSession({ sessionId, identity, expiresAt: inSeconds(3600) })), null, String(sessionId))
  }
})

test('an identity without sub is refused', async () => {
  const { api } = loadIdentity()
  assert.equal(await api.readSession(await api.sealSession({ ...session, identity: { ...identity, sub: '' }, expiresAt: inSeconds(3600) })), null)
})

test('in production the cookie name carries the __Host- prefix', async () => {
  assert.equal(loadIdentity({ secure: true }).api.IDENTITY_COOKIE_NAME, '__Host-ban_identity')
  assert.equal(loadIdentity({ secure: false }).api.IDENTITY_COOKIE_NAME, 'ban_identity')

  const sealed = await loadIdentity({ secure: true }).api.sealSession({ ...session, expiresAt: inSeconds(3600) })
  const { api, cookieNames } = loadIdentity({ secure: true, cookieValue: sealed })
  assert.deepEqual(plain(await api.getCurrentAgent()), session)
  assert.deepEqual(cookieNames, ['__Host-ban_identity'])
})

test('a missing or short secret fails with an explicit message', async () => {
  for (const secret of [undefined, '', 'x'.repeat(31)]) {
    const { api, errors } = loadIdentity({ secret })
    assert.throws(() => api.getSessionKey(), { name: 'SessionSecretError', message: /SESSION_SECRET manquante ou trop courte \(32 caractères minimum\)/ })
    await assert.rejects(api.sealSession({ ...session, expiresAt: inSeconds(3600) }), { message: /SESSION_SECRET/ })
    assert.equal(await api.readSession('any.token.value.here.x'), null)
    assert.equal(errors.length, 1)
  }
  assert.equal(loadIdentity({ secret: 'x'.repeat(32) }).api.getSessionKey().length, 32)
})

test('only display and local check fields are kept, display fields truncated', () => {
  const { api } = loadIdentity()
  const kept = plain(api.pickIdentity({
    ...identity,
    aud: 'client-id',
    iss: 'https://proconnect.example',
    exp: NOW + 60,
    iat: NOW,
    email_verified: true,
    label: 'x',
    given_name: 'é'.repeat(200),
    organization: { name: 'Mairie', siren: '216006270' },
  }))
  assert.equal(kept.given_name.length, 128)
  assert.deepEqual(kept.organization, { name: 'Mairie' })
  for (const field of ['email_verified', 'label', 'aud', 'iss', 'exp', 'iat']) {
    assert.equal(field in kept, false, field)
  }
  assert.equal(kept.siret, identity.siret)
})

test('a long identity seals under 4 KB, an oversized one is refused', async () => {
  const { api } = loadIdentity()
  const long = 'Éléonore-Hélène '.repeat(13).slice(0, 200)
  const longIdentity = api.pickIdentity({
    ...identity,
    sub: crypto.randomUUID() + crypto.randomUUID(),
    email: 'e'.repeat(240) + '@thourotte.fr',
    given_name: long,
    usual_name: long,
    family_name: long,
    name: long,
    nom_structure: long,
    organization: { name: long },
  })
  const sealed = await api.sealSession({ sessionId: 'A'.repeat(43), identity: longIdentity, expiresAt: inSeconds(3600) })
  assert.ok(`__Host-ban_identity=${encodeURIComponent(sealed)}`.length <= 4096, String(sealed.length))
  await assert.rejects(
    api.sealSession({ ...session, identity: { ...identity, email: 'e'.repeat(4000) }, expiresAt: inSeconds(3600) }),
    { message: /trop volumineux/ },
  )
})
