import { NextResponse } from 'next/server'
import { getProviderConfig, objToUrlParams } from '@/utils/oauth'
import { cookies } from 'next/headers'
import * as client from 'openid-client'
import { env } from 'next-runtime-env'
export const dynamic = 'force-dynamic'

const NEXT_PUBLIC_ADRESSE_URL = env('NEXT_PUBLIC_ADRESSE_URL')

export async function GET(request: Request) {
  // eslint-disable-next-line
  const hostname = new URL(`${NEXT_PUBLIC_ADRESSE_URL}`).hostname
  const isProd = env('NODE_ENV') === 'production'
  try {
    const cookieStore = cookies()
    const { searchParams } = new URL(request.url)

    const returnUrlParam = searchParams.get('returnUrl')
    const hasPostLogoutCookie = cookieStore.get('post_logout_return_url')
    const isLogoutInitiated = cookieStore.get('logout_initiated')
    const isCallback = !returnUrlParam && hasPostLogoutCookie && isLogoutInitiated

    const returnUrl = hasPostLogoutCookie?.value || returnUrlParam || '/'

    if (isCallback) {
      // Rediriger vers l'URL de retour avec suppression des cookies
      const response = NextResponse.redirect(`${env('HOST')}${returnUrl}`)

      response.cookies.set('post_logout_return_url', '', {
        path: '/',
        expires: new Date(0),
        domain: hostname,
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
      })
      response.cookies.set('logout_initiated', '', {
        path: '/',
        expires: new Date(0),
        domain: hostname,
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
      })

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
    response.cookies.set('post_logout_return_url', returnUrl, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 300,
      path: '/',
      domain: hostname,
    })
    response.cookies.set('logout_initiated', 'true', {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 300,
      path: '/',
      domain: hostname,
    })

    // Supprimer les cookies liés à l'identité avec la bonne config
    const cookiesToDelete = ['userinfo', 'idtoken', 'id_token_hint', 'oauth2token']
    cookiesToDelete.forEach((name) => {
      response.cookies.set(name, '', {
        path: '/',
        domain: hostname,
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        expires: new Date(0),
      })
    })

    return response
  }
  catch (error) {
    const { searchParams } = new URL(request.url)
    const fallbackUrl: string = searchParams.get('returnUrl') || '/'
    return NextResponse.redirect(`${env('HOST')}${fallbackUrl}`)
  }
}
