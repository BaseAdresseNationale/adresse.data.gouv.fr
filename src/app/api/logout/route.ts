import { NextResponse } from 'next/server'
import { getProviderConfig, objToUrlParams } from '@/utils/oauth'
import { cookies } from 'next/headers'
import * as client from 'openid-client'
import { env } from '@/utils/env'
import { SESSION_EXPIRED_REASON } from '@/utils/sessionExpired'
import { toInternalPath } from '@/utils/url'
import { IDENTITY_COOKIE_NAME, getCurrentAgent } from '@/lib/identity'
import { revokeBanSession } from '@/lib/ban-session'
import { rejectCrossSiteRequest } from '@/lib/request-guard'
import { LEGACY_IDENTITY_COOKIES, appendCookie, appendCookieDeletions } from '@/lib/auth-cookies'

export const dynamic = 'force-dynamic'

const IDENTITY_COOKIES = [IDENTITY_COOKIE_NAME, 'id_token_hint', 'ban_connected', ...LEGACY_IDENTITY_COOKIES]
const LOGOUT_RETURN_COOKIES = ['post_logout_return_url', 'logout_initiated']

type LogoutRequest = { returnUrl?: unknown, reason?: unknown }

async function readLogoutRequest(request: Request): Promise<LogoutRequest> {
  const body = await request.json().catch(() => null)
  return typeof body === 'object' && body !== null ? body : {}
}

function buildReturnPath({ returnUrl, reason }: LogoutRequest): string {
  const returnPath = toInternalPath(typeof returnUrl === 'string' ? returnUrl : null)
  if (reason !== SESSION_EXPIRED_REASON || returnPath.includes('reason=')) return returnPath

  const separator = returnPath.includes('?') ? '&' : '?'
  return `${returnPath}${separator}reason=${SESSION_EXPIRED_REASON}`
}

// Déconnexion en POST JSON depuis le site : un lien ou une image d'un autre site ne déconnecte personne.
export async function POST(request: Request) {
  const rejection = rejectCrossSiteRequest(request)
  if (rejection) return rejection

  const returnPath = buildReturnPath(await readLogoutRequest(request))
  const agent = await getCurrentAgent()
  if (agent) await revokeBanSession(agent.sessionId)

  try {
    const cookieStore = await cookies()
    const idTokenHint = cookieStore.get('id_token_hint')?.value?.replace(/^"(.*)"$/, '$1')
    const config = await getProviderConfig()
    const logoutParams = {
      post_logout_redirect_uri: `${env('HOST')}/api/logout`,
      ...(idTokenHint && { id_token_hint: idTokenHint }),
    }
    const redirectUrl = client.buildEndSessionUrl(config, objToUrlParams(logoutParams)).toString()

    const response = NextResponse.json({ redirectUrl })
    const returnCookies = [
      { name: 'post_logout_return_url', value: returnPath },
      { name: 'logout_initiated', value: 'true' },
    ]
    for (const cookie of returnCookies) {
      appendCookie({ response, ...cookie, maxAge: 300, httpOnly: true })
    }
    appendCookieDeletions({ response, names: IDENTITY_COOKIES })
    return response
  }
  catch (error) {
    console.error('Logout failed', error)
    const response = NextResponse.json({ redirectUrl: returnPath })
    appendCookieDeletions({ response, names: IDENTITY_COOKIES })
    return response
  }
}

// Seul le retour de ProConnect passe ici ; toute autre visite repart à l'accueil sans rien toucher.
export async function GET() {
  const cookieStore = await cookies()
  const savedReturnPath = cookieStore.get('post_logout_return_url')?.value
  if (!savedReturnPath || !cookieStore.get('logout_initiated')) {
    return NextResponse.redirect(new URL('/', env('HOST')))
  }

  const response = NextResponse.redirect(new URL(toInternalPath(savedReturnPath), env('HOST')))
  appendCookieDeletions({ response, names: LOGOUT_RETURN_COOKIES })
  return response
}
