import { useState, useEffect, useRef } from 'react'

export const useDebounce = (value: string, timeoutMs: number = 500) => {
  const timeout = useRef<NodeJS.Timeout>()
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current)
    }
    timeout.current = setTimeout(() => {
      setDebouncedValue(value)
    }, timeoutMs)
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
    }
  }, [value, timeoutMs])

  return debouncedValue
}
