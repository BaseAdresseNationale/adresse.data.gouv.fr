'use client'

import { env } from 'next-runtime-env'

import { useEffect } from 'react'
import { customFetch } from '@/lib/fetch'

export default function ProConnectRedirectClient() {
  useEffect(() => {
    const lastVisitedUrl = localStorage.getItem('previousUrl')

    if (typeof window === 'undefined') return
    const backFromProConnect = window.location.href.indexOf('code=') !== -1 && window.location.href.indexOf('state=') !== -1 && window.location.href.indexOf('iss=') !== -1

    // authenticated from ProConnect just after visited unit commune page, redirect to this unit page commune and clear lastVisitedUrl
    if (backFromProConnect && lastVisitedUrl && window.location.href !== lastVisitedUrl && window.location.href.indexOf('/commune/') == -1 && lastVisitedUrl.indexOf('/commune/') !== -1) {
      const response = customFetch('/api/me')
      response.then(async (data) => {
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

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
        await customFetch('/api/proconnect-session', options)
      })
        .finally(() => {
          localStorage.setItem('previousUrl', '')
          window.location.href = lastVisitedUrl
        })
        .catch((error) => {
          console.error('ProConnectRedirectClient: error fetching user data after ProConnect authentication', error)
        })
    }
  }, [])

  return null
}
