import { env } from '@/utils/env'
import type { Agent } from '@/lib/identity'

const BAN_SESSION_HEADER = 'X-Ban-Session'

type BanSession = {
  sessionId: string
  expiresAt: Date
}

class BanSessionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BanSessionError'
  }
}

const sessionUrl = () => `${env('NEXT_PUBLIC_API_BAN_URL')}/api/session`

const serviceAuthorization = () => `Token ${env('BAN_API_TOKEN')}`

// Sans délai, une API qui ne répond pas bloque la connexion ou la déconnexion jusqu'à 300 s.
const API_TIMEOUT_MS = 5000

function sessionHeaders(sessionId: string): Record<string, string> {
  return { 'Authorization': serviceAuthorization(), [BAN_SESSION_HEADER]: sessionId }
}

// En-têtes de toute route de l'API qui agit pour l'agent : l'API tire son identité de la session.
export function banAgentHeaders(agent: Agent): Record<string, string> {
  return sessionHeaders(agent.sessionId)
}

function parseBanSession(body: unknown): BanSession {
  const { sessionId, expiresAt } = (body as { response?: { sessionId?: unknown, expiresAt?: unknown } } | null)?.response ?? {}
  if (typeof sessionId !== 'string' || !sessionId) {
    throw new BanSessionError('Session BAN sans identifiant')
  }

  const expiry = new Date(typeof expiresAt === 'string' ? expiresAt : Number.NaN)
  if (Number.isNaN(expiry.getTime()) || expiry.getTime() <= Date.now()) {
    throw new BanSessionError('Session BAN sans échéance valide')
  }
  return { sessionId, expiresAt: expiry }
}

// L'API vérifie elle-même les deux jetons ProConnect bruts avant d'ouvrir la session.
export async function createBanSession({ idToken, userinfo }: { idToken: string, userinfo: string }): Promise<BanSession> {
  const response = await fetch(sessionUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': serviceAuthorization() },
    body: JSON.stringify({ idToken, userinfo }),
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  })

  if (!response.ok) {
    throw new BanSessionError(`Session BAN refusée (${response.status})`)
  }
  return parseBanSession(await response.json().catch(() => null))
}

// Ne rejette jamais : la déconnexion locale doit aboutir même si l'API ne répond pas.
export async function revokeBanSession(sessionId: string): Promise<void> {
  try {
    const response = await fetch(sessionUrl(), {
      method: 'DELETE',
      headers: sessionHeaders(sessionId),
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    })
    if (!response.ok && response.status !== 401 && response.status !== 404) {
      console.error('[ban-session] Révocation refusée', response.status)
    }
  }
  catch (error) {
    console.error('[ban-session] Révocation impossible', error)
  }
}
