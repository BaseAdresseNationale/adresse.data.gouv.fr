import React, {useEffect, createContext, useState} from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'

const PIWIK_URL = process.env.NEXT_PUBLIC_PIWIK_URL
const PIWIK_SITE_ID = process.env.NEXT_PUBLIC_PIWIK_SITE_ID
const MOBILE_WIDTH = 900

export const DeviceContext = createContext()

function MyApp({Component, pageProps, isSafariBrowser}) {
  const [viewHeight, setViewHeight] = useState('100vh')
  const [isMobileDevice, setIsMobileDevice] = useState(false)

  const handleResize = () => {
    setViewHeight(`${window.innerWidth}px`)
    setIsMobileDevice(window.innerWidth < MOBILE_WIDTH)
  }

  const logPageView = () => {
    if (window.Piwik) {
      const tracker = window.Piwik.getTracker(`${PIWIK_URL}/piwik.php`, PIWIK_SITE_ID)

      if (tracker) {
        tracker.trackPageView()
      }
    }
  }

  useEffect(() => {
    setTimeout(() => {
      logPageView()
    }, 400)
  })

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <DeviceContext.Provider value={{
        viewHeight,
        isMobileDevice,
        isSafariBrowser
      }}
      >
        <Component {...pageProps} />
      </DeviceContext.Provider>
      <style global jsx>{`
        body,
        html,
        #__next {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }
        `}</style>
    </>
  )
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
  isSafariBrowser: PropTypes.bool.isRequired
}

MyApp.getInitialProps = async ({ctx}) => {
  const {req} = ctx
  const {headers} = req
  const userAgent = headers['user-agent']
  const isSafariBrowser = userAgent.toLowerCase().includes('safari')

  return {isSafariBrowser}
}

export default MyApp
