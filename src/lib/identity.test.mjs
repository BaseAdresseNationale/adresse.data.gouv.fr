import assert from 'node:assert/strict'
import * as crypto from 'node:crypto'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import * as jose from 'jose'
import ts from 'typescript'

const { outputText } = ts.transpileModule(
  readFileSync(new URL('./identity.ts', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
)
const SECRET = 'a'.repeat(32) + '-local-test-secret'
const NOW = Math.floor(Date.now() / 1000)

function loadIdentity(options = {}) {
  const { cookieValue } = options
  const secret = 'secret' in options ? options.secret : SECRET
  const exports = {}
  const errors = []
  runInNewContext(outputText, {
    exports,
    require(name) {
      if (name === 'node:crypto') return crypto
      if (name === 'jose') return jose
      if (name === 'next/headers') return { cookies: async () => ({ get: () => cookieValue === undefined ? undefined : { value: cookieValue } }) }
      assert.equal(name, '@/utils/env')
      return { env: key => (key === 'SESSION_SECRET' ? secret : undefined) }
    },
    console: { error: (...args) => errors.push(args) },
  })
  return { api: exports, errors }
}

const plain = value => JSON.parse(JSON.stringify(value))
const agent = { sub: 'agent-sub', email: 'agent@thourotte.fr', siret: '21600627000019', aud: 'client-id', iss: 'https://proconnect.example', exp: NOW + 60, iat: NOW }

test('reading refuses an absent, plain, tampered, foreign or expired cookie', async () => {
  const { api } = loadIdentity()
  const valid = await api.sealIdentity({ identity: agent, expiresAt: NOW + 3600 })
  const tampered = valid.slice(0, -4) + (valid.endsWith('AAAA') ? 'BBBB' : 'AAAA')
  const foreign = await loadIdentity({ secret: 'b'.repeat(40) }).api.sealIdentity({ identity: agent, expiresAt: NOW + 3600 })
  const expired = await api.sealIdentity({ identity: agent, expiresAt: NOW - 10 })
  for (const [label, value] of [['absent', undefined], ['plain', '{"sub":"x"}'], ['tampered', tampered], ['foreign', foreign], ['expired', expired]]) {
    assert.equal(await api.readIdentity(value), null, label)
  }
})

test('reading a valid cookie returns the identity with the userinfo exp and iat intact', async () => {
  const { api } = loadIdentity()
  const sealed = await api.sealIdentity({ identity: agent, expiresAt: NOW + 3600 })
  assert.deepEqual(plain(await api.readIdentity(sealed)), agent)
  assert.deepEqual(plain(await loadIdentity({ cookieValue: sealed }).api.getCurrentIdentity()), agent)
})

test('an identity without sub is refused', async () => {
  const { api } = loadIdentity()
  assert.equal(await api.readIdentity(await api.sealIdentity({ identity: { ...agent, sub: '' }, expiresAt: NOW + 3600 })), null)
})

test('a missing or short secret fails with an explicit message', async () => {
  for (const secret of [undefined, '', 'x'.repeat(31)]) {
    const { api, errors } = loadIdentity({ secret })
    assert.throws(() => api.getSessionKey(), { name: 'SessionSecretError', message: /SESSION_SECRET manquante ou trop courte \(32 caractères minimum\)/ })
    await assert.rejects(api.sealIdentity({ identity: agent, expiresAt: NOW + 3600 }), { message: /SESSION_SECRET/ })
    assert.equal(await api.readIdentity('any.token.value.here.x'), null)
    assert.equal(errors.length, 1)
  }
  assert.equal(loadIdentity({ secret: 'x'.repeat(32) }).api.getSessionKey().length, 32)
})

test('only whitelisted fields are kept and display fields are truncated', () => {
  const { api } = loadIdentity()
  const identity = plain(api.pickIdentity({ ...agent, email_verified: true, label: 'x', given_name: 'é'.repeat(200), organization: { name: 'Mairie', siren: '216006270' } }))
  assert.equal(identity.given_name.length, 128)
  assert.deepEqual(identity.organization, { name: 'Mairie' })
  assert.equal('email_verified' in identity, false)
  assert.equal('label' in identity, false)
  assert.equal(identity.exp, agent.exp)
})

test('a long identity seals under 4 KB, an oversized one is refused', async () => {
  const { api } = loadIdentity()
  const long = 'Éléonore-Hélène '.repeat(13).slice(0, 200)
  const identity = api.pickIdentity({
    ...agent,
    sub: crypto.randomUUID() + crypto.randomUUID(),
    email: 'e'.repeat(240) + '@thourotte.fr',
    given_name: long,
    usual_name: long,
    family_name: long,
    name: long,
    nom_structure: long,
    organization: { name: long },
  })
  const sealed = await api.sealIdentity({ identity, expiresAt: NOW + 3600 })
  assert.ok(`ban_identity=${encodeURIComponent(sealed)}`.length <= 4096, String(sealed.length))
  await assert.rejects(
    api.sealIdentity({ identity: { ...agent, email: 'e'.repeat(4000) }, expiresAt: NOW + 3600 }),
    { message: /trop volumineux/ },
  )
})

test('expiry is the userinfo exp plus 6 hours, or the id_token exp without it', () => {
  const { api } = loadIdentity()
  assert.equal(api.identityExpiresAt({ userinfoExp: 1000, idTokenExp: 500 }), 1000 + 6 * 3600)
  assert.equal(api.identityExpiresAt({ userinfoExp: undefined, idTokenExp: 500 }), 500 + 6 * 3600)
})
