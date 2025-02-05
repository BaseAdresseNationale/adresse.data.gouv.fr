import { useCallback, useState } from 'react'

export function useDOMRef<T>() {
  const [ref, _setRef] = useState<T | null>(null)

  const setRef = useCallback((node: T) => {
    if (node !== null) {
      _setRef(node)
    }
  }, [])

  return [ref, setRef] as [T | null, typeof setRef]
}
