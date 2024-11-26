'use client'

import 'altcha'
import { useCallback, useEffect, useState } from 'react'
import { env } from 'next-runtime-env'

const ALTCHA_API_KEY = env('NEXT_PUBLIC_ALTCHA_API_KEY')

interface LoaderProps {
  children: React.ReactNode
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onVerified: () => void
  showCatpcha?: boolean
}

export default function NewsletterOptin({ children, handleSubmit, onVerified, showCatpcha }: LoaderProps) {
  const [altchaElement, setAltchaElement] = useState<HTMLElement | null>(null)
  const onRefChange = useCallback((node: HTMLElement) => {
    setAltchaElement(node)
  }, [])

  useEffect(() => {
    if (!altchaElement) {
      return
    }

    const eventHandler = (ev: any) => {
      if (ev.detail.state === 'verified') {
        onVerified()
      }
    }

    altchaElement.addEventListener('statechange', eventHandler)

    return () => {
      if (!altchaElement) {
        return
      }
      altchaElement.removeEventListener('statechange', eventHandler)
    }
  }, [altchaElement, onVerified])

  return (
    <form onSubmit={handleSubmit}>
      {children}
      {showCatpcha && (
        <altcha-widget
          ref={onRefChange as any}
          challengeurl={`https://eu.altcha.org/api/v1/challenge?apiKey=${ALTCHA_API_KEY}`}
          spamfilter
        >
        </altcha-widget>
      )}
    </form>
  )
}
