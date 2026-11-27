import assert from 'node:assert/strict'
import * as crypto from 'node:crypto'
import * as http from 'node:http'
import * as jose from 'jose'
import { loadTsModule } from './load-ts-module.mjs'

export const SITE = 'https://site.example'
export const IDENTITY_COOKIES = ['ban_identity', 'id_token_hint', 'ban_connected', 'userinfo', 'idtoken', 'oauth2token']

const ENV = {
  SESSION_SECRET: 'a'.repeat(32),
  HOST: SITE,
  NEXT_PUBLIC_ADRESSE_URL: SITE,
}

export const envModule = (overrides = {}) => ({ env: key => ({ ...ENV, ...overrides })[key] })

const source = path => new URL(`../${path}`, import.meta.url)

export const loadUrlModule = () => loadTsModule({ url: source('utils/url.ts') })

export const identityCookieName = ({ secure = false } = {}) => (secure ? '__Host-ban_identity' : 'ban_identity')

export function loadIdentityModule({ env = envModule(), cookieValue, secure = false } = {}) {
  const cookieName = identityCookieName({ secure })
  return loadTsModule({
    url: source('lib/identity.ts'),
    imports: {
      'node:crypto': crypto,
      jose,
      'next/headers': { cookies: async () => ({ get: name => (name === cookieName && cookieValue ? { value: cookieValue } : undefined) }) },
      '@/utils/env': env,
      '@/utils/secure': { __esModule: true, default: secure },
    },
  })
}

export function loadAuthCookiesModule({ secure = true } = {}) {
  return loadTsModule({
    url: source('lib/auth-cookies.ts'),
    imports: { '@/utils/secure': { __esModule: true, default: secure }, '@/utils/env': envModule() },
  })
}

export function loadBanSessionModule({ env = envModule(), fetch }) {
  return loadTsModule({
    url: source('lib/ban-session.ts'),
    imports: { '@/utils/env': env },
    globals: { fetch, AbortSignal },
  })
}

// Fake BAN API that accepts every connection and never answers.
export async function startSilentApi() {
  const requests = []
  const server = http.createServer(request => requests.push(`${request.method} ${request.url}`))
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    requests,
    close() {
      server.closeAllConnections()
      server.close()
    },
  }
}

export function loadRequestGuardModule({ nextServer }) {
  return loadTsModule({
    url: source('lib/request-guard.ts'),
    imports: { 'next/server': nextServer, '@/utils/env': envModule() },
  })
}

// Headers of a JSON call sent by a page of the site, accepted by the cross-site guard.
export const SITE_JSON_HEADERS = { 'Origin': SITE, 'Content-Type': 'application/json' }

// Seals a session the way the login callback does, for route tests that need a connected agent.
export const sealAgent = ({ sessionId = 'session-id', identity = { sub: 'agent-sub', email: 'agent@thourotte.fr' }, secure = false } = {}) =>
  loadIdentityModule({ secure }).sealSession({ sessionId, identity, expiresAt: new Date(Date.now() + 3600 * 1000) })

// Set-Cookie headers of a response, grouped by cookie name, in emission order.
export function setCookiesByName(response) {
  const byName = {}
  for (const header of response.headers.getSetCookie()) {
    const name = header.slice(0, header.indexOf('='))
    byName[name] = [...(byName[name] ?? []), header]
  }
  return byName
}

export const cookieValue = header => decodeURIComponent(header.slice(header.indexOf('=') + 1).split(';')[0])

// A cookie is erased when both its legacy Domain variant and its host-only variant expire.
// A `__Host-` cookie never had a Domain variant: only its host-only deletion is expected.
export function assertErased({ byName, name }) {
  const headers = byName[name] ?? []
  const hasDomainDeletion = headers.some(header => header.includes('Domain=') && header.includes('Max-Age=0'))
  assert.equal(hasDomainDeletion, !name.startsWith('__Host-'), `${name} : variante Domain`)
  assert.ok(headers.some(header => !header.includes('Domain=') && header.includes('Max-Age=0')), `${name} : variante sans Domain`)
}
