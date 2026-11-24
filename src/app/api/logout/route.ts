import { NextResponse } from 'next/server'
import { getProviderConfig, objToUrlParams } from '@/utils/oauth'
import { cookies } from 'next/headers'
import * as client from 'openid-client'
import { env } from '@/utils/env'
import { SESSION_EXPIRED_REASON } from '@/utils/sessionExpired'
import { toInternalPath } from '@/utils/url'
import { IDENTITY_COOKIE_NAME } from '@/lib/identity'
import { LEGACY_IDENTITY_COOKIES, appendCookie, appendCookieDeletions } from '@/lib/auth-cookies'

export const dynamic = 'force-dynamic'

const IDENTITY_COOKIES = [IDENTITY_COOKIE_NAME, 'id_token_hint', 'ban_connected', ...LEGACY_IDENTITY_COOKIES]
const LOGOUT_RETURN_COOKIES = ['post_logout_return_url', 'logout_initiated']

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const { searchParams } = new URL(request.url)

    const returnUrlParam = searchParams.get('returnUrl')
    const reason = searchParams.get('reason')
    const hasPostLogoutCookie = cookieStore.get('post_logout_return_url')
    const isLogoutInitiated = cookieStore.get('logout_initiated')
    const isCallback = !returnUrlParam && hasPostLogoutCookie && isLogoutInitiated

    let returnUrl = toInternalPath(hasPostLogoutCookie?.value || returnUrlParam)
    if (reason === SESSION_EXPIRED_REASON && !returnUrl.includes('reason=')) {
      const separator = returnUrl.includes('?') ? '&' : '?'
      returnUrl = `${returnUrl}${separator}reason=${SESSION_EXPIRED_REASON}`
    }

    if (isCallback) {
      // Rediriger vers l'URL de retour avec suppression des cookies
      const response = NextResponse.redirect(new URL(returnUrl, env('HOST')))
      appendCookieDeletions({ response, names: LOGOUT_RETURN_COOKIES })
      return response
    }

    // Début du logout : enregistrer le retour + suppression cookies
    let id_token_hint = cookieStore.get('id_token_hint')?.value
    if (id_token_hint) {
      id_token_hint = id_token_hint.replace(/^"(.*)"$/, '$1')
    }

    // Préparer config et URL de redirection finale
    const config = await getProviderConfig()
    const logoutParams = {
      post_logout_redirect_uri: `${env('HOST')}/api/logout`,
      ...(id_token_hint && { id_token_hint }),
    }
    const redirectUrl = client.buildEndSessionUrl(config, objToUrlParams(logoutParams)).toString()

    // Créer la réponse de redirection avec status 302 et Location
    const response = NextResponse.redirect(redirectUrl, 302)

    // Stocker les cookies utiles pour callback
    const returnCookies = [
      { name: 'post_logout_return_url', value: returnUrl },
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
    const { searchParams } = new URL(request.url)
    const response = NextResponse.redirect(new URL(toInternalPath(searchParams.get('returnUrl')), env('HOST')))
    appendCookieDeletions({ response, names: IDENTITY_COOKIES })
    return response
  }
}
