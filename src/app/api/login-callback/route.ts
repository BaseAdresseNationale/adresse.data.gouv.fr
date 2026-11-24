import * as client from 'openid-client'
import { NextRequest, NextResponse } from 'next/server'
import { configOptions, getProviderConfig, getCurrentUrl } from '@/utils/oauth'
import { getOrganizationName } from '@/lib/api-insee-sirene'
import { createBanSession } from '@/lib/ban-session'
import { IDENTITY_COOKIE_NAME, identityExpiresAt, pickIdentity, sealIdentity } from '@/lib/identity'
import { LEGACY_IDENTITY_COOKIES, appendCookie, appendCookieDeletions } from '@/lib/auth-cookies'

export const dynamic = 'force-dynamic'

import { env } from '@/utils/env'
import { toInternalPath } from '@/utils/url'
const NEXT_PUBLIC_ADRESSE_URL = env('NEXT_PUBLIC_ADRESSE_URL')

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

    if (!claims) throw new Error('Claims are undefined')
    const userinfo = await client.fetchUserInfo(
      config,
      tokens.access_token,
      claims.sub,
      configOptions as client.DPoPOptions
    )

    let enrichedUserinfo: Record<string, unknown> = { ...userinfo }

    if (typeof userinfo.siret === 'string') {
      const organizationName = await getOrganizationName(userinfo.siret)
      if (organizationName) {
        const organization = typeof userinfo.organization === 'object' && userinfo.organization !== null
          ? { ...(userinfo.organization as Record<string, unknown>), name: organizationName }
          : { name: organizationName }

        enrichedUserinfo = {
          ...enrichedUserinfo,
          nom_structure: organizationName,
          organization,
        }
      }
    }

    const identity = pickIdentity(enrichedUserinfo)
    const expiresAt = identityExpiresAt({ userinfoExp: userinfo.exp, idTokenExp: claims.exp })
    const identityMaxAge = expiresAt - Math.floor(Date.now() / 1000)
    if (identityMaxAge <= 0) throw new Error('Identité déjà expirée')
    const sealedIdentity = await sealIdentity({ identity, expiresAt })

    createBanSession(identity).catch(() => {})

    // avoid relative path, https://nextjs.org/docs/messages/middleware-relative-urls
    const returnTo = req.cookies.get('auth_return_to')?.value
    const url = new URL(returnTo ? toInternalPath(returnTo) : '', NEXT_PUBLIC_ADRESSE_URL)
    if (!returnTo) {
      url.search = req.nextUrl.search.toString()
    }
    const response = NextResponse.redirect(url)

    appendCookieDeletions({ response, names: ['nonce', 'state', 'auth_return_to', ...LEGACY_IDENTITY_COOKIES] })
    const sessionCookies = [
      { name: IDENTITY_COOKIE_NAME, value: sealedIdentity, maxAge: identityMaxAge, httpOnly: true },
      { name: 'id_token_hint', value: JSON.stringify(tokens.id_token), httpOnly: true },
      { name: 'ban_connected', value: 'true', httpOnly: false },
    ]
    for (const cookie of sessionCookies) {
      appendCookie({ response, ...cookie })
    }

    return response
  }
  catch (error) {
    console.error('Login callback failed', error)
    return NextResponse.json({ error: 'Callback failed' }, { status: 500 })
  }
}
