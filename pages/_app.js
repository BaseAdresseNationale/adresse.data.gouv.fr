import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import App from 'next/app'

import {DeviceContextProvider} from '@/contexts/device'

const PIWIK_URL = process.env.NEXT_PUBLIC_PIWIK_URL
const PIWIK_SITE_ID = process.env.NEXT_PUBLIC_PIWIK_SITE_ID

function MyApp({Component, pageProps, isSafariBrowser}) {
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

  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <DeviceContextProvider isSafariBrowser={isSafariBrowser}>
        <Component {...pageProps} />
      </DeviceContextProvider>
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

MyApp.getInitialProps = async appContext => {
  const appProps = await App.getInitialProps(appContext)
  const {req} = appContext.ctx

  if (req) {
    const {headers} = req
    const userAgent = headers['user-agent']
    appProps.isSafariBrowser = userAgent.toLowerCase().includes('safari')
  } else {
    appProps.isSafariBrowser = navigator.userAgent.toLowerCase().includes('safari')
  }

  return appProps
}

export default MyApp
