import {useEffect} from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import Link from 'next/link'
import {createNextDsfrIntegrationApi} from '@codegouvfr/react-dsfr/next-pagesdir'
import {useIsDark} from '@codegouvfr/react-dsfr/useIsDark'
import {DeviceContextProvider} from '@/contexts/device'
import {init as matomoInit} from '@socialgouv/matomo-next'
import BALWidget from '@/components/bal-widget/bal-widget'

import '@/styles/template-data-gouv-to-dsfr/normalizer.css'
import '@/styles/template-data-gouv-to-dsfr/main-alternate.css'

const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID

const {
  withDsfr,
  dsfrDocumentApi
} = createNextDsfrIntegrationApi({
  DefaultColorScheme: 'light',
  Link
})

export {dsfrDocumentApi}

function MyApp({Component, pageProps}) {
  const {setIsDark} = useIsDark()

  useEffect(() => {
    setIsDark(false)
  }, [setIsDark])

  useEffect(() => {
    matomoInit({url: MATOMO_URL, siteId: MATOMO_SITE_ID})
  }, [])

  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <DeviceContextProvider>
        <div id='alert-root' />
        <Component {...pageProps} />
        <BALWidget />
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

export default withDsfr(MyApp)
