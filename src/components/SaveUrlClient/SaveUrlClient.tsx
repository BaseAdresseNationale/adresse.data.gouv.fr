'use client'

import { useEffect, useState } from 'react'

export default function SaveUrlClient() {
  const [previousSavedUrl, setPreviousSavedUrl] = useState('')
  const [storedValue, setStoredValue] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const currentUrl = window.location.href
    setPreviousSavedUrl(currentUrl)
    setStoredValue(currentUrl)
    localStorage.setItem('previousUrl', currentUrl)
  }, [])

  return null
}
