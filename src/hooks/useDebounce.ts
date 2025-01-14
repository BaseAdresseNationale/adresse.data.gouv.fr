import { useState, useEffect, useCallback, useRef } from 'react'

// TODO : Use only one useDebounce function

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

export const useDebouncedCallback = (callback: ((...args: any[]) => void), delay: number) => {
  const callbackRef = useRef(callback)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  return useCallback(
    (...args: any[]) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    },
    [delay]
  )
}
