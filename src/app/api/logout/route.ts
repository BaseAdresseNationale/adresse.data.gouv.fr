import { NextResponse } from 'next/server'
import { getProviderConfig, objToUrlParams } from '@/utils/oauth'
import { cookies } from 'next/headers'
import * as client from 'openid-client'
import { env } from 'next-runtime-env'

export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    const { searchParams } = new URL(request.url)

    // Vérifier si c'est un callback de ProConnect
    const returnUrlParam = searchParams.get('returnUrl')
    const hasPostLogoutCookie = cookieStore.get('post_logout_return_url')
    const isLogoutInitiated = cookieStore.get('logout_initiated')

    // C'est un callback si pas de returnUrl, qu'on a le cookie de retour ET le flag de logout initié
    const isCallback = !returnUrlParam && hasPostLogoutCookie && isLogoutInitiated

    if (isCallback) {
      // C'est un callback de ProConnect - récupérer l'URL de retour du cookie
      const returnUrl = hasPostLogoutCookie.value || '/'

      // Supprimer les cookies
      cookieStore.delete('post_logout_return_url')
      cookieStore.delete('logout_initiated')

      // Rediriger vers l'URL de retour
      return NextResponse.redirect(`${env('HOST')}${returnUrl}`)
    }

    // C'est un logout initial - traiter normalement
    const returnUrl: string = returnUrlParam || '/'

    let id_token_hint = cookieStore.get('id_token_hint')?.value

    // Nettoyer les guillemets supplémentaires du token
    if (id_token_hint) {
      id_token_hint = id_token_hint.replace(/^"(.*)"$/, '$1')
    }

    // Stocker l'URL de retour et marquer comme logout initié
    cookieStore.set('post_logout_return_url', returnUrl, {
      httpOnly: true,
      secure: env('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: 300, // 5 minutes
      path: '/',
    })

    cookieStore.set('logout_initiated', 'true', {
      httpOnly: true,
      secure: env('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: 300, // 5 minutes
      path: '/',
    })

    // Liste des cookies qu'on veut supprimer
    const cookiesToDelete = ['userinfo', 'idtoken', 'id_token_hint', 'oauth2token']

    cookieStore.getAll().forEach((cookie) => {
      if (cookiesToDelete.includes(cookie.name)) {
        cookieStore.delete(cookie.name)
      }
    })

    const config = await getProviderConfig()
    const logoutParams = {
      post_logout_redirect_uri: `${env('HOST')}/api/logout`,
      ...(id_token_hint && { id_token_hint }),
    }

    const redirectUrl = client.buildEndSessionUrl(config, objToUrlParams(logoutParams))
    return NextResponse.redirect(redirectUrl)
  }
  catch (error) {
    const { searchParams } = new URL(request.url)
    const returnUrlParam = searchParams.get('returnUrl')
    const fallbackUrl: string = returnUrlParam || '/'
    return NextResponse.redirect(`${env('HOST')}${fallbackUrl}`)
  }
}
