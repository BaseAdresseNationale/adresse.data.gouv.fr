import {useState, useEffect, useMemo, useRef} from 'react'
import styled from 'styled-components'
import {useRouter} from 'next/router'
import {push as matomoPush} from '@socialgouv/matomo-next'
import getConfig from 'next/config'

const {
  isDevMode,
  NEXT_PUBLIC_BAL_WIDGET_URL: BAL_WIDGET_URL,
  NEXT_PUBLIC_BAL_ADMIN_API_URL: BAL_ADMIN_API_URL
} = getConfig().publicRuntimeConfig

const matomoCategoryName = `${isDevMode ? 'DEVMODE - ' : ''}BAL Widget (Front)`

const StyledIFrame = styled.iframe`
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 999;
  ${({$isOpen}) => $isOpen ? 'height: 600px; width: 450px;' : 'height: 60px; width: 60px;'}


  @media screen and (max-width: 450px) {
    bottom: 10px;
    right: 10px;
    ${({$isOpen}) => $isOpen && 'width: calc(100% - 20px);'}
  }
`

function BALWidget() {
  const balWidgetRef = useRef(null)
  const [isBalWidgetOpen, setIsBalWidgetOpen] = useState(false)
  const [isBalWidgetReady, setIsBalWidgetReady] = useState(false)
  const [balWidgetConfig, setBalWidgetConfig] = useState(null)
  const router = useRouter()

  // Fetch BAL widget config
  useEffect(() => {
    async function fetchBalWidgetConfig() {
      try {
        const response = await fetch(`${BAL_ADMIN_API_URL}/bal-widget/config`)
        const data = await response.json()
        if (response.status !== 200) {
          throw new Error(data.message)
        }

        setBalWidgetConfig(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchBalWidgetConfig()
  }, [])

  // Send config to BAL widget
  // once it's ready
  useEffect(() => {
    if (balWidgetRef.current && isBalWidgetReady) {
      balWidgetRef.current.contentWindow.postMessage(
        {
          type: 'BAL_WIDGET_CONFIG',
          content: balWidgetConfig,
        },
        '*'
      )
    }
  }, [isBalWidgetReady, balWidgetRef, balWidgetConfig])

  useEffect(() => {
    function BALWidgetMessageHandler(event) {
      switch (event.data?.type) {
        case 'BAL_WIDGET_OPENED':
          matomoPush(['trackEvent', matomoCategoryName, 'Location changed', '/', 1])
          setIsBalWidgetOpen(true)
          break
        case 'BAL_WIDGET_CLOSED':
          // Wait for transition to end before closing the iframe
          setTimeout(() => {
            setIsBalWidgetOpen(false)
          }, 300)
          break
        case 'BAL_WIDGET_LOCATION':
          if (isBalWidgetOpen) {
            matomoPush(['trackEvent', matomoCategoryName, 'Location changed', event.data.content, 1])
          }

          break
        case 'BAL_WIDGET_READY':
          setIsBalWidgetReady(true)
          break
        default:
          break
      }
    }

    window.addEventListener('message', BALWidgetMessageHandler)

    return () => {
      window.removeEventListener('message', BALWidgetMessageHandler)
    }
  }, [isBalWidgetOpen])

  const isWidgetDisabled = useMemo(() => {
    if (balWidgetConfig) {
      const availablePages = balWidgetConfig.global.showOnPages || []
      return balWidgetConfig.global.hideWidget ||
        (availablePages.length > 0 && availablePages.every(page => router.pathname !== page))
    }

    return true
  }, [router.pathname, balWidgetConfig])

  const isWidgetDisplayed = !isWidgetDisabled || isBalWidgetOpen

  return isWidgetDisplayed ? (
    <StyledIFrame
      ref={balWidgetRef}
      src={BAL_WIDGET_URL}
      $isOpen={isBalWidgetOpen}
    />
  ) : null
}

export default BALWidget
