import { useState, useEffect } from 'react'

export const useHash = () => {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  return hash
}

export const getPageFromHash = (hash: string) => {
  const hashQuery = new URLSearchParams(hash.slice(1))
  return parseInt(hashQuery.get('page') || '1', 10)
}

export const resetHash = () => {
  window.location.hash = ''
}
