import assert from 'node:assert/strict'
import test from 'node:test'
import { loadTsModule } from '../test-utils/load-ts-module.mjs'

const PROVIDER_LOGOUT = 'https://proconnect.example/logout'

function loadLogout(fetch) {
  const navigations = []
  const logoutModule = loadTsModule({
    url: new URL('./logout.ts', import.meta.url),
    globals: {
      fetch,
      window: { location: { assign: url => navigations.push(url) } },
      console: { error() {} },
    },
  })
  return { ...logoutModule, navigations }
}

const failures = {
  'refused by the cross-site guard': async () => new Response(null, { status: 403 }),
  'answered by a server error': async () => new Response(null, { status: 500 }),
  'cut by a network error': async () => { throw new TypeError('fetch failed') },
}

for (const [name, fetch] of Object.entries(failures)) {
  test(`a logout ${name} stays on the page and reports the failure`, async () => {
    const { logout, hasLogoutFailed, navigations } = loadLogout(fetch)

    await logout({ returnUrl: '/admin' })

    assert.deepEqual(navigations, [])
    assert.equal(hasLogoutFailed(), true)
  })
}

test('a successful logout leaves for ProConnect and clears an earlier failure', async () => {
  let attempt = 0
  const { logout, hasLogoutFailed, navigations } = loadLogout(async () => {
    attempt += 1
    return attempt === 1
      ? new Response(null, { status: 500 })
      : Response.json({ redirectUrl: PROVIDER_LOGOUT })
  })

  await logout({ returnUrl: '/admin' })
  await logout({ returnUrl: '/admin' })

  assert.deepEqual(navigations, [PROVIDER_LOGOUT])
  assert.equal(hasLogoutFailed(), false)
})
