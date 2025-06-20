'use client'

import { useEffect, useState } from 'react'

export default function SaveUrlClient() {
  const [previousSavedUrl, setPreviousSavedUrl] = useState('')
  const [storedValue, setStoredValue] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    setPreviousSavedUrl(window.location.href)

    setStoredValue(previousSavedUrl)
    localStorage.setItem('previousUrl', window.location.href)
  }, [previousSavedUrl])

  return null
}
