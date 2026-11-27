import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

const { outputText } = ts.transpileModule(
  readFileSync(new URL('./auth-cookies.ts', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } },
)

function loadCookies({ secure = false } = {}) {
  const exports = {}
  runInNewContext(outputText, {
    exports,
    require(name) {
      if (name === '@/utils/secure') return { __esModule: true, default: secure }
      assert.equal(name, '@/utils/env')
      return { env: key => (key === 'NEXT_PUBLIC_ADRESSE_URL' ? 'https://adresse.example.gouv.fr' : undefined) }
    },
    URL,
    Date,
  })
  return exports
}

const setCookies = (response, name) => response.headers.getSetCookie().filter(header => header.startsWith(`${name}=`))

test('a cookie is set without Domain', () => {
  const api = loadCookies({ secure: true })
  const response = new Response(null)
  api.appendCookie({ response, name: 'ban_connected', value: 'true', httpOnly: false })
  assert.equal(response.headers.getSetCookie().at(-1), 'ban_connected=true; Path=/; Secure; SameSite=Lax')
})

test('a deletion erases both variants of each cookie, the legacy Domain one first', () => {
  const api = loadCookies()
  const response = new Response(null)
  api.appendCookieDeletions({ response, names: ['userinfo', 'idtoken'] })
  for (const name of ['userinfo', 'idtoken']) {
    const [legacy, hostOnly, ...rest] = setCookies(response, name)
    assert.equal(rest.length, 0)
    assert.match(legacy, /; Domain=adresse\.example\.gouv\.fr(;|$)/)
    assert.match(legacy, /Max-Age=0/)
    assert.match(legacy, /Expires=Thu, 01 Jan 1970 00:00:00 GMT/)
    assert.doesNotMatch(hostOnly, /Domain=/)
    assert.match(hostOnly, /Max-Age=0/)
  }
})

test('a set erases the legacy Domain variant first, both headers kept in order', () => {
  const api = loadCookies()
  const response = new Response(null, { status: 307, headers: { Location: 'https://adresse.example.gouv.fr/' } })
  api.appendCookie({ response, name: 'ban_identity', value: 'sealed', maxAge: 600, httpOnly: true })
  const [legacy, hostOnly, ...rest] = setCookies(response, 'ban_identity')
  assert.equal(rest.length, 0)
  assert.match(legacy, /Domain=/)
  assert.equal(hostOnly, 'ban_identity=sealed; Path=/; Max-Age=600; HttpOnly; SameSite=Lax')
})

test('values are URL-encoded', () => {
  const api = loadCookies()
  assert.equal(api.serializeCookie({ name: 'auth_return_to', value: '/admin?x=1', httpOnly: true }), 'auth_return_to=%2Fadmin%3Fx%3D1; Path=/; HttpOnly; SameSite=Lax')
})

test('a __Host- cookie has no Domain variant, its deletion keeps the write attributes', () => {
  const api = loadCookies({ secure: true })
  const written = new Response(null)
  api.appendCookie({ response: written, name: '__Host-ban_identity', value: 'sealed', maxAge: 600, httpOnly: true })
  assert.deepEqual(setCookies(written, '__Host-ban_identity'), ['__Host-ban_identity=sealed; Path=/; Max-Age=600; Secure; HttpOnly; SameSite=Lax'])

  const erased = new Response(null)
  api.appendCookieDeletions({ response: erased, names: ['__Host-ban_identity'] })
  const [deletion, ...rest] = setCookies(erased, '__Host-ban_identity')
  assert.equal(rest.length, 0)
  assert.equal(deletion, '__Host-ban_identity=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; HttpOnly; SameSite=Lax')
})
