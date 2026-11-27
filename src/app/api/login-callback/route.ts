import * as client from 'openid-client'
import { NextRequest, NextResponse } from 'next/server'
import { configOptions, fetchSignedUserinfo, getProviderConfig, getCurrentUrl } from '@/utils/oauth'
import { getOrganizationName } from '@/lib/api-insee-sirene'
import { createBanSession } from '@/lib/ban-session'
import { IDENTITY_COOKIE_NAME, pickIdentity, sealSession } from '@/lib/identity'
import { LEGACY_IDENTITY_COOKIES, appendCookie, appendCookieDeletions } from '@/lib/auth-cookies'

export const dynamic = 'force-dynamic'

import { env } from '@/utils/env'
import { toInternalPath } from '@/utils/url'
const NEXT_PUBLIC_ADRESSE_URL = env('NEXT_PUBLIC_ADRESSE_URL')

const LOGIN_COOKIES = ['nonce', 'state', 'auth_return_to']
const LOGIN_ERROR_PATH = '/connexion/erreur'

async function enrichWithOrganizationName(userinfo: client.UserInfoResponse): Promise<Record<string, unknown>> {
  if (typeof userinfo.siret !== 'string') return { ...userinfo }

  const organizationName = await getOrganizationName(userinfo.siret)
  if (!organizationName) return { ...userinfo }

  const organization = typeof userinfo.organization === 'object' && userinfo.organization !== null
    ? { ...(userinfo.organization as Record<string, unknown>), name: organizationName }
    : { name: organizationName }
  return { ...userinfo, nom_structure: organizationName, organization }
}

export async function GET(req: NextRequest) {
  try {
    const config = await getProviderConfig()
    const currentUrl = getCurrentUrl(req)
    const tokens = await client.authorizationCodeGrant(
      config,
      currentUrl,
      {
        expectedNonce: req.cookies.get('nonce')?.value,
        expectedState: req.cookies.get('state')?.value,
      },
      undefined,
      configOptions as client.AuthorizationCodeGrantOptions
    )
    const claims = tokens.claims()

    if (!claims || !tokens.id_token) throw new Error('Claims or id_token are undefined')
    const { userinfo, jwt } = await fetchSignedUserinfo({ config, accessToken: tokens.access_token, expectedSub: claims.sub })
    const identity = pickIdentity(await enrichWithOrganizationName(userinfo))

    // Pas de révocation sur une erreur après cette ligne : l'identifiant n'a pas quitté le serveur et la session expire seule.
    const { sessionId, expiresAt } = await createBanSession({ idToken: tokens.id_token, userinfo: jwt })
    const sessionMaxAge = Math.floor((expiresAt.getTime() - Date.now()) / 1000)
    if (sessionMaxAge <= 0) throw new Error('Session déjà expirée')
    const sealedSession = await sealSession({ sessionId, identity, expiresAt })

    // avoid relative path, https://nextjs.org/docs/messages/middleware-relative-urls
    const returnTo = req.cookies.get('auth_return_to')?.value
    const url = new URL(returnTo ? toInternalPath(returnTo) : '', NEXT_PUBLIC_ADRESSE_URL)
    if (!returnTo) {
      url.search = req.nextUrl.search.toString()
    }
    const response = NextResponse.redirect(url)

    appendCookieDeletions({ response, names: [...LOGIN_COOKIES, ...LEGACY_IDENTITY_COOKIES] })
    const sessionCookies = [
      { name: IDENTITY_COOKIE_NAME, value: sealedSession, maxAge: sessionMaxAge, httpOnly: true },
      { name: 'id_token_hint', value: JSON.stringify(tokens.id_token), maxAge: sessionMaxAge, httpOnly: true },
      { name: 'ban_connected', value: 'true', maxAge: sessionMaxAge, httpOnly: false },
    ]
    for (const cookie of sessionCookies) {
      appendCookie({ response, ...cookie })
    }

    return response
  }
  catch (error) {
    console.error('Login callback failed', error)
    const response = NextResponse.redirect(new URL(LOGIN_ERROR_PATH, NEXT_PUBLIC_ADRESSE_URL))
    appendCookieDeletions({ response, names: LOGIN_COOKIES })
    return response
  }
}
