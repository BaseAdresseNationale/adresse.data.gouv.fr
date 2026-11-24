/**
 * Écriture des cookies des routes d'authentification, toujours sans attribut `Domain`.
 *
 * Next indexe `response.cookies` et `cookies()` par nom : un second `set` du même nom écrase le premier.
 * Effacer un ancien cookie posé avec `Domain` puis poser le nouveau exige deux en-têtes `Set-Cookie`
 * du même nom : ils sont ajoutés avec `response.headers.append`, jamais par `response.cookies` ni `cookies()`.
 */
import secureSetup from '@/utils/secure'
import { env } from '@/utils/env'

const EXPIRED = new Date(0)

// Cookies posés par les versions précédentes du site, à effacer chez les agents.
export const LEGACY_IDENTITY_COOKIES = ['userinfo', 'idtoken', 'oauth2token']

type SerializeCookieOptions = {
  name: string
  value: string
  maxAge?: number
  expires?: Date
  httpOnly: boolean
  domain?: string
}

export function serializeCookie({ name, value, maxAge, expires, httpOnly, domain }: SerializeCookieOptions): string {
  const attributes = [`${name}=${encodeURIComponent(value)}`, 'Path=/']
  if (maxAge !== undefined) attributes.push(`Max-Age=${maxAge}`)
  if (expires) attributes.push(`Expires=${expires.toUTCString()}`)
  if (domain) attributes.push(`Domain=${domain}`)
  if (secureSetup) attributes.push('Secure')
  if (httpOnly) attributes.push('HttpOnly')
  attributes.push('SameSite=Lax')
  return attributes.join('; ')
}

type AppendCookieOptions = { response: Response, name: string, value: string, maxAge?: number, httpOnly: boolean }

// Variante posée par les versions précédentes du site, avec `Domain` : une suppression sans `Domain` ne la retire pas.
function appendLegacyDomainDeletion({ response, name }: { response: Response, name: string }) {
  const domain = new URL(`${env('NEXT_PUBLIC_ADRESSE_URL')}`).hostname
  response.headers.append('Set-Cookie', serializeCookie({ name, value: '', maxAge: 0, expires: EXPIRED, httpOnly: true, domain }))
}

export function appendCookie({ response, name, value, maxAge, httpOnly }: AppendCookieOptions) {
  appendLegacyDomainDeletion({ response, name })
  response.headers.append('Set-Cookie', serializeCookie({ name, value, maxAge, httpOnly }))
}

export function appendCookieDeletions({ response, names }: { response: Response, names: string[] }) {
  for (const name of names) {
    appendLegacyDomainDeletion({ response, name })
    response.headers.append('Set-Cookie', serializeCookie({ name, value: '', maxAge: 0, expires: EXPIRED, httpOnly: true }))
  }
}
