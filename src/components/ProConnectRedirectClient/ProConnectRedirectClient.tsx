'use client'

import { useEffect } from 'react'

export default function ProConnectRedirectClient() {
  useEffect(() => {
    const lastVisitedUrl = localStorage.getItem('previousUrl')

    if (typeof window === 'undefined') return
    const backFromProConnect = window.location.href.indexOf('code=') !== -1 && window.location.href.indexOf('state=') !== -1 && window.location.href.indexOf('iss=') !== -1

    // authenticated from ProConnect just after visited unit commune page, redirect to this unit page commune and clear lastVisitedUrl
    if (backFromProConnect && lastVisitedUrl && window.location.href !== lastVisitedUrl && window.location.href.indexOf('/commune/') == -1 && lastVisitedUrl.indexOf('/commune/') !== -1) {
      localStorage.setItem('previousUrl', '')
      window.location.href = lastVisitedUrl
    }
  }, [])

  return null
}
