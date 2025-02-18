import { useState, useEffect, useCallback } from 'react'

export const useHash = () => {
  const [hash, setHash] = useState('')

  const resetHash = useCallback(() => {
    if (window.location.hash) {
      window.history.pushState('', document.title, `${window.location.pathname}${window.location.search}`)
    }
    setHash('')
  }, [])

  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return { hash, resetHash }
}

export const getPageFromHash = (hash: string) => {
  const hashQuery = new URLSearchParams(hash.slice(1))
  return parseInt(hashQuery.get('page') || '1', 10)
}
