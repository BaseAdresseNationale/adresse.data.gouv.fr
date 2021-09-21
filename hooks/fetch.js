import {useState, useCallback, useEffect} from 'react'
import {useDebouncedCallback} from 'use-debounce'

import _fetch from '../lib/fetch'

export function useFetch(url, options, debounced) {
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(Boolean(url))
  const [error, setError] = useState(null)

  const _search = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await _fetch(url, options)
      setResponse(response)
    } catch (error) {
      setError(error)
    }
  }, [options, url])

  const [debouncedFunction] = useDebouncedCallback(_search, 200)

  useEffect(() => {
    if (response || error) {
      setLoading(false)
    }
  }, [response, error])

  useEffect(() => {
    if (url) {
      if (debounced) {
        debouncedFunction()
      } else {
        _search()
      }
    }
  }, [url, options, _search, debounced, debouncedFunction])

  return [response, loading, error]
}
