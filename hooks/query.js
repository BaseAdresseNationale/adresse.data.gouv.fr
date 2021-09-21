import {useState, useEffect} from 'react'

export function useQuery(value, func) {
  const [url, setUrl] = useState('')
  const [options, setOptions] = useState(null)

  useEffect(() => {
    if (value && func) {
      const {url, options} = func(value)
      setUrl(url)
      setOptions(options)
    }
  }, [value, func])

  return [url, options]
}
