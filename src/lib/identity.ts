import { createHash } from 'node:crypto'
import { EncryptJWT, jwtDecrypt } from 'jose'
import { cookies } from 'next/headers'
import { env } from '@/utils/env'
import secureSetup from '@/utils/secure'

// Le préfixe `__Host-` impose au navigateur `Secure`, `Path=/` et l'absence de `Domain` : réservé à HTTPS.
export const IDENTITY_COOKIE_NAME = secureSetup ? '__Host-ban_identity' : 'ban_identity'

const DISPLAY_FIELD_MAX_LENGTH = 128
const MAX_COOKIE_BYTES = 4096
const MIN_SECRET_LENGTH = 32

// Affichage et contrôles locaux de l'interface : l'API tire l'identité de la session, jamais de ces champs.
export type Identity = {
  sub: string
  email?: string
  given_name?: string
  usual_name?: string
  family_name?: string
  name?: string
  siret?: string
  nom_structure?: string
  organization?: { name?: string }
}

export type Agent = {
  sessionId: string
  identity: Identity
}

const DISPLAY_FIELDS = ['given_name', 'usual_name', 'family_name', 'name', 'nom_structure'] as const
const IDENTIFIER_FIELDS = ['email', 'siret'] as const

export class SessionSecretError extends Error {
  constructor() {
    super(`SESSION_SECRET manquante ou trop courte (${MIN_SECRET_LENGTH} caractères minimum)`)
    this.name = 'SessionSecretError'
  }
}

const truncate = (value: string) => value.slice(0, DISPLAY_FIELD_MAX_LENGTH)

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.length > 0

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

// Le cookie expire avec la session de l'API (`expiresAt`), jamais après.
export async function sealSession({ sessionId, identity, expiresAt }: Agent & { expiresAt: Date }): Promise<string> {
  const token = await new EncryptJWT({ sessionId, identity })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .encrypt(getSessionKey())

  if (IDENTITY_COOKIE_NAME.length + 1 + encodeURIComponent(token).length > MAX_COOKIE_BYTES) {
    throw new Error('Cookie d\'identité trop volumineux')
  }
  return token
}

export async function readSession(value: string | undefined): Promise<Agent | null> {
  if (!value) return null

  try {
    const { payload } = await jwtDecrypt(value, getSessionKey(), {
      keyManagementAlgorithms: ['dir'],
      contentEncryptionAlgorithms: ['A256GCM'],
    })
    const { sessionId, identity } = payload as { sessionId?: unknown, identity?: Identity }
    if (!isNonEmptyString(sessionId) || typeof identity !== 'object' || identity === null || !isNonEmptyString(identity.sub)) {
      return null
    }
    return { sessionId, identity }
  }
  catch (error) {
    if (error instanceof SessionSecretError) {
      console.error(error.message)
    }
    return null
  }
}

export async function getCurrentAgent(): Promise<Agent | null> {
  return readSession((await cookies()).get(IDENTITY_COOKIE_NAME)?.value)
}
