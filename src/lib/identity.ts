import { createHash } from 'node:crypto'
import { EncryptJWT, jwtDecrypt } from 'jose'
import { cookies } from 'next/headers'
import { env } from '@/utils/env'

export const IDENTITY_COOKIE_NAME = 'ban_identity'

// Même échéance que le contrôle de session de l'API : `exp` de userinfo plus 6 h.
const API_SESSION_GRACE_SECONDS = 6 * 60 * 60
const DISPLAY_FIELD_MAX_LENGTH = 128
const MAX_COOKIE_BYTES = 4096
const MIN_SECRET_LENGTH = 32

export type Identity = {
  sub: string
  email?: string
  given_name?: string
  usual_name?: string
  family_name?: string
  name?: string
  siret?: string
  aud?: string
  exp?: number
  iat?: number
  iss?: string
  nom_structure?: string
  organization?: { name?: string }
}

const DISPLAY_FIELDS = ['given_name', 'usual_name', 'family_name', 'name', 'nom_structure'] as const
const IDENTIFIER_FIELDS = ['email', 'siret', 'aud', 'iss'] as const
const TIMESTAMP_FIELDS = ['exp', 'iat'] as const

export class SessionSecretError extends Error {
  constructor() {
    super(`SESSION_SECRET manquante ou trop courte (${MIN_SECRET_LENGTH} caractères minimum)`)
    this.name = 'SessionSecretError'
  }
}

const truncate = (value: string) => value.slice(0, DISPLAY_FIELD_MAX_LENGTH)

export function pickIdentity(userinfo: Record<string, unknown>): Identity {
  const identity: Identity = { sub: typeof userinfo.sub === 'string' ? userinfo.sub : '' }

  for (const field of DISPLAY_FIELDS) {
    const value = userinfo[field]
    if (typeof value === 'string') identity[field] = truncate(value)
  }
  for (const field of IDENTIFIER_FIELDS) {
    const value = userinfo[field]
    if (typeof value === 'string') identity[field] = value
  }
  for (const field of TIMESTAMP_FIELDS) {
    const value = userinfo[field]
    if (typeof value === 'number') identity[field] = value
  }

  const organization = userinfo.organization
  if (typeof organization === 'object' && organization !== null) {
    const { name } = organization as Record<string, unknown>
    identity.organization = typeof name === 'string' ? { name: truncate(name) } : {}
  }

  return identity
}

// Lue à l'appel : `next build` charge les modules de route sans les secrets d'exécution.
export function getSessionKey(): Uint8Array {
  const secret = env('SESSION_SECRET')
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    throw new SessionSecretError()
  }
  return createHash('sha256').update(secret).digest()
}

export function identityExpiresAt({ userinfoExp, idTokenExp }: { userinfoExp?: unknown, idTokenExp: number }): number {
  const exp = typeof userinfoExp === 'number' ? userinfoExp : idTokenExp
  return exp + API_SESSION_GRACE_SECONDS
}

// L'identité est imbriquée : l'`exp` du JWT n'écrase jamais l'`exp` de userinfo, comparé par la session de l'API.
export async function sealIdentity({ identity, expiresAt }: { identity: Identity, expiresAt: number }): Promise<string> {
  const token = await new EncryptJWT({ identity })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .encrypt(getSessionKey())

  if (IDENTITY_COOKIE_NAME.length + 1 + encodeURIComponent(token).length > MAX_COOKIE_BYTES) {
    throw new Error('Cookie d\'identité trop volumineux')
  }
  return token
}

export async function readIdentity(value: string | undefined): Promise<Identity | null> {
  if (!value) return null

  try {
    const { payload } = await jwtDecrypt(value, getSessionKey(), {
      keyManagementAlgorithms: ['dir'],
      contentEncryptionAlgorithms: ['A256GCM'],
    })
    const identity = payload.identity as Identity | undefined
    if (typeof identity !== 'object' || identity === null || typeof identity.sub !== 'string' || !identity.sub) {
      return null
    }
    return identity
  }
  catch (error) {
    if (error instanceof SessionSecretError) {
      console.error(error.message)
    }
    return null
  }
}

export async function getCurrentIdentity(): Promise<Identity | null> {
  return readIdentity((await cookies()).get(IDENTITY_COOKIE_NAME)?.value)
}
