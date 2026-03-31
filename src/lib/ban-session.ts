import { env } from 'next-runtime-env'

const BAN_API_TOKEN = env('BAN_API_TOKEN')
const NEXT_PUBLIC_API_BAN_URL = env('NEXT_PUBLIC_API_BAN_URL')

export type UserInfoSession = {
  sub: string
  name?: string
  usual_name?: string
  email?: string
  given_name?: string
  family_name?: string
  siret?: string
  aud?: string
  exp?: number
  iat?: number
  iss?: string
  [key: string]: unknown
}

export type CreateBanSessionResult =
  | { ok: true, status: number, data?: unknown }
  | { ok: false, status: number, data?: unknown }

/**
 * Crée ou réutilise la session BAN pour un utilisateur (côté serveur).
 * À appeler une fois au login pour éviter de recréer une session à chaque chargement de page.
 */
export async function createBanSession(userInfo: UserInfoSession): Promise<CreateBanSessionResult> {
  if (!userInfo.sub) {
    return { ok: false, status: 400, data: { error: 'Missing required field: sub' } }
  }

  const sessionPayload = {
    sub: userInfo.sub,
    name: userInfo.name ?? userInfo.usual_name ?? userInfo.email,
    givenName: userInfo.given_name,
    familyName: userInfo.family_name,
    usualName: userInfo.usual_name,
    email: userInfo.email,
    siret: userInfo.siret,
    aud: userInfo.aud,
    exp: userInfo.exp,
    iat: userInfo.iat,
    iss: userInfo.iss,
  }

  const response = await fetch(`${NEXT_PUBLIC_API_BAN_URL}/api/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${BAN_API_TOKEN}`,
    },
    body: JSON.stringify(sessionPayload),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok && (data as { message?: string }).message === 'Session already exists') {
    return { ok: true, status: 200, data: { message: 'Session already exists' } }
  }

  if (!response.ok) {
    console.error('[ban-session] BAN API error', response.status, data)
    return { ok: false, status: response.status, data }
  }

  return { ok: true, status: response.status, data }
}
