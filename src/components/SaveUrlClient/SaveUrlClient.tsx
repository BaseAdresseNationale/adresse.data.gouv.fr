'use client'

import { useEffect, useState } from 'react'

export default function SaveUrlClient() {
  const [previousSavedUrl, setPreviousSavedUrl] = useState('')
  const [storedValue, setStoredValue] = useState('')
  const [hydrated, setHydrated] = useState<boolean>(false)

  useEffect(() => {
    const changeHydrated = (value: boolean) => {
      setHydrated(value)
    }
    const changeValues = (url: string) => {
      setPreviousSavedUrl(url)
      setStoredValue(url)
    }
    changeHydrated(true)
    if (typeof window === 'undefined') return

    const currentUrl = window.location.href
    changeValues(currentUrl)
    localStorage.setItem('previousUrl', currentUrl)
  }, [])

  return null
}
