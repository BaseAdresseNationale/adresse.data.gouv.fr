import assert from 'node:assert/strict'
import * as crypto from 'node:crypto'
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

export function loadIdentityModule({ env = envModule(), cookieValue } = {}) {
  return loadTsModule({
    url: source('lib/identity.ts'),
    imports: {
      'node:crypto': crypto,
      jose,
      'next/headers': { cookies: async () => ({ get: name => (name === 'ban_identity' && cookieValue ? { value: cookieValue } : undefined) }) },
      '@/utils/env': env,
    },
  })
}

export function loadAuthCookiesModule() {
  return loadTsModule({
    url: source('lib/auth-cookies.ts'),
    imports: { '@/utils/secure': { __esModule: true, default: true }, '@/utils/env': envModule() },
  })
}

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
export function assertErased({ byName, name }) {
  const headers = byName[name] ?? []
  assert.ok(headers.some(header => header.includes('Domain=') && header.includes('Max-Age=0')), `${name} : variante Domain`)
  assert.ok(headers.some(header => !header.includes('Domain=') && header.includes('Max-Age=0')), `${name} : variante sans Domain`)
}
