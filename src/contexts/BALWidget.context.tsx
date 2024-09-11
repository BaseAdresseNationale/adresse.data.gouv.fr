'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { matomoTrackEvent } from '@/lib/matomo'

export const StyledIFrame = styled.iframe<{ $isOpen: boolean }>`
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 999;
  // Fix to avoid white box when dark mode is enabled
  color-scheme: normal;
  border: none;
  ${({ $isOpen }) => $isOpen ? 'height: 600px; width: 450px;' : 'height: 60px; width: 60px;'}


  @media screen and (max-width: 450px) {
    bottom: 10px;
    right: 10px;
    ${({ $isOpen }) => $isOpen && 'width: calc(100% - 20px);'}
  }
`

interface BALWidgetContext {
  open: () => void
  close: () => void
  navigate: (to: string) => void
  isBalWidgetOpen: boolean
  isBalWidgetReady: boolean
}

const BALWidgetContext = React.createContext<BALWidgetContext>({
  open: () => {},
  close: () => {},
  navigate: () => {},
  isBalWidgetOpen: false,
  isBalWidgetReady: false,
})

interface BALWidgetProviderProps {
  children: React.ReactNode
}

export function BALWidgetProvider({ children }: BALWidgetProviderProps) {
  const balWidgetRef = useRef<HTMLIFrameElement>(null)
  const transitionTimeout = useRef<NodeJS.Timeout>()
  const [isBalWidgetOpen, setIsBalWidgetOpen] = useState(false)
  const [isBalWidgetReady, setIsBalWidgetReady] = useState(false)
  const [balWidgetConfig, setBalWidgetConfig] = useState(null)

  const open = useCallback(() => {
    if (balWidgetRef.current) {
      balWidgetRef.current.contentWindow?.postMessage(
        {
          type: 'BAL_WIDGET_OPEN',
        },
        '*'
      )
    }
  }, [balWidgetRef])

  const close = useCallback(() => {
    if (balWidgetRef.current) {
      balWidgetRef.current.contentWindow?.postMessage(
        {
          type: 'BAL_WIDGET_CLOSE',
        },
        '*'
      )
    }
  }, [balWidgetRef])

  const navigate = useCallback((to: string) => {
    if (balWidgetRef.current) {
      balWidgetRef.current.contentWindow?.postMessage(
        {
          type: 'BAL_WIDGET_NAVIGATE',
          content: to,
        },
        '*'
      )
    }
  }, [balWidgetRef])

  // Fetch BAL widget config
  useEffect(() => {
    async function fetchBalWidgetConfig() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BAL_ADMIN_API_URL}/bal-widget/config`)
        const data = await response.json()
        if (response.status !== 200) {
          throw new Error(data.message)
        }

        setBalWidgetConfig(data)
      }
      catch (error) {
        console.error(error)
      }
    }

    fetchBalWidgetConfig()
  }, [])

  // Send config to BAL widget
  // once it's ready
  useEffect(() => {
    if (balWidgetRef.current && !isBalWidgetReady && balWidgetConfig) {
      console.log('Sending config to BAL widget')
      balWidgetRef.current.contentWindow?.postMessage(
        {
          type: 'BAL_WIDGET_CONFIG',
          content: balWidgetConfig,
        },
        '*'
      )
    }
  }, [isBalWidgetReady, balWidgetRef, balWidgetConfig])

  useEffect(() => {
    function BALWidgetMessageHandler(event: { data: { type: string, content: any } }) {
      switch (event.data?.type) {
        case 'BAL_WIDGET_OPENED':
          if (transitionTimeout.current) {
            clearTimeout(transitionTimeout.current)
          }
          matomoTrackEvent('BAL_WIDGET (Front)', 'Location changed', '/', 1)
          setIsBalWidgetOpen(true)
          break
        case 'BAL_WIDGET_CLOSED':
          // Wait for transition to end before closing the iframe
          if (transitionTimeout.current) {
            clearTimeout(transitionTimeout.current)
          }
          transitionTimeout.current = setTimeout(() => {
            setIsBalWidgetOpen(false)
          }, 300)
          break
        case 'BAL_WIDGET_LOCATION':
          if (isBalWidgetOpen) {
            matomoTrackEvent('BAL_WIDGET (Front)', 'Location changed', event.data.content, 1)
          }
          break
        case 'BAL_WIDGET_CONFIG_LOADED':
          console.log('BAL widget loaded')
          setIsBalWidgetReady(true)
          break
        default:
          break
      }
    }

    window.addEventListener('message', BALWidgetMessageHandler)

    return () => {
      window.removeEventListener('message', BALWidgetMessageHandler)
      clearTimeout(transitionTimeout.current)
    }
  }, [isBalWidgetOpen])

  return (
    <BALWidgetContext.Provider value={{
      open,
      close,
      navigate,
      isBalWidgetOpen,
      isBalWidgetReady,
    }}
    >
      {children}
      <StyledIFrame
        ref={balWidgetRef}
        src={process.env.NEXT_PUBLIC_BAL_WIDGET_URL}
        $isOpen={isBalWidgetOpen}
      />
    </BALWidgetContext.Provider>
  )
}

export const BALWidgetConsumer = BALWidgetContext.Consumer

export default BALWidgetContext
