import {useEffect} from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import {DeviceContextProvider} from '@/contexts/device'

import '@/styles/template-data-gouv-to-dsfr/normalizer.css'
import '@/styles/template-data-gouv-to-dsfr/main-alternate.css'

const PIWIK_URL = process.env.NEXT_PUBLIC_PIWIK_URL
const PIWIK_SITE_ID = process.env.NEXT_PUBLIC_PIWIK_SITE_ID

function MyApp({Component, pageProps}) {
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
      <DeviceContextProvider>
        <div id='alert-root' />
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
}

export default MyApp
