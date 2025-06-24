'use client'

import { env } from 'next-runtime-env'

import { useEffect } from 'react'
import { customFetch } from '@/lib/fetch'

export default function ProConnectRedirectClient({ token }: { token: string }) {
  useEffect(() => {
    const lastVisitedUrl = localStorage.getItem('previousUrl')

    if (typeof window === 'undefined') return
    const backFromProConnect = window.location.href.indexOf('code=') !== -1 && window.location.href.indexOf('state=') !== -1 && window.location.href.indexOf('iss=') !== -1

    // authenticated from ProConnect just after visited unit commune page, redirect to this unit page commune and clear lastVisitedUrl
    if (backFromProConnect && lastVisitedUrl && window.location.href !== lastVisitedUrl && window.location.href.indexOf('/commune/') == -1 && lastVisitedUrl.indexOf('/commune/') !== -1) {
      const response = customFetch('/api/me')
      response.then((data) => {
        // console.log('ProConnectRedirectClient: user authenticated from ProConnect, redirect to last visited commune page', data)

        const {
          sub,
          name,
          given_name,
          family_name,
          usual_name,
          email,
          siret,
          aud,
          exp,
          iat,
          iss,
        } = JSON.parse(data)

        const body = {
          sub,
          name,
          given_name,
          family_name,
          usual_name,
          email,
          siret,
          aud,
          exp,
          iat,
          iss,
        }

        console.log('token', token)
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token,
          },
          body: JSON.stringify(body),
        }
        customFetch(`${env('NEXT_PUBLIC_API_BAN_URL')}/api/session`, options)
        localStorage.setItem('previousUrl', '')
        window.location.href = lastVisitedUrl
      }).catch((error) => {
        console.error('ProConnectRedirectClient: error fetching user data after ProConnect authentication', error)
      })
    }
  }, [token])

  return null
}
