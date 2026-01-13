'use client'

import Link from 'next/link'
import { ToastContainer, Slide } from 'react-toastify'
import { DsfrHead } from '@codegouvfr/react-dsfr/next-appdir/DsfrHead'
import { DsfrProvider } from '@codegouvfr/react-dsfr/next-appdir/DsfrProvider'
import { getHtmlAttributes } from '@codegouvfr/react-dsfr/next-appdir/getHtmlAttributes'

import { StartDsfr } from '@/providers'
import { LayoutProvider } from '@/layouts/MainLayout'
import Header from '@/layouts/Header'
import Footer from '@/layouts/Footer'
// import Breadcrumb from '@/layouts/Breadcrumb'
import { defaultColorScheme } from '@/theme/defaultColorScheme'
import { ThemeProvider } from 'styled-components'
import StyledComponentsRegistry from '@/providers/StyledComponentsRegistry'
import theme from '@/theme'
import GlobalStyle from './global.styles'
import { useEffect } from 'react'
import { init as matomoInit } from '@socialgouv/matomo-next'
import { BALWidgetProvider } from '@/contexts/BALWidget.context'
import { PublicEnvScript, env } from 'next-runtime-env'

import {
  StyledLayout,
  PageWrapper,
} from './layout.styles'

export default function RootLayout({ children }: { children: JSX.Element }) {
  const lang = 'fr'

  // TODO : Connect to Grist API
  // const sampleNotice = {
  // text: 'Déploiement en cours lundi 31 mars. Les exports "latest" sont suspendus pendant 48h.',
  // }

  const dataNotices = {
    // data: [sampleNotice],
    data: [{
      text: `Rappel : L'API Adresse est remplacée par l'API de Géocodage. L'url sera décommissionnée fin Janvier 2026. Pensez à effectuer la bascule dans vos services. Plus d'info sur le Blog.`,
      link: {
        href: 'https://adresse.data.gouv.fr/blog/lapi-adresse-de-la-base-adresse-nationale-est-transferee-a-lign',
      },
    }],
    duration: 4000,
  }

  useEffect(() => {
    if (!env('NEXT_PUBLIC_MATOMO_URL') || !env('NEXT_PUBLIC_MATOMO_SITE_ID')) {
      return
    }

    matomoInit({ url: env('NEXT_PUBLIC_MATOMO_URL') || '', siteId: env('NEXT_PUBLIC_MATOMO_SITE_ID') || '' })
  }, [])

  return (
    <html {...getHtmlAttributes({ defaultColorScheme, lang })}>
      <head>
        <PublicEnvScript />
        <StartDsfr />
        <DsfrHead
          Link={Link}
          preloadFonts={[
            'Marianne-Regular',
            'Marianne-Medium',
            'Marianne-Bold',
          ]}
        />
      </head>
      <body>
        <DsfrProvider lang={lang}>
          <StyledComponentsRegistry>
            <LayoutProvider>
              <ThemeProvider theme={theme}>
                <BALWidgetProvider>
                  <GlobalStyle />
                  <StyledLayout>
                    <Header notices={dataNotices} />
                    <PageWrapper>
                      {
                      // <Breadcrumb />
                      }
                      {children}
                    </PageWrapper>
                    <Footer />
                    <ToastContainer
                      position="bottom-right"
                      autoClose={5000}
                      hideProgressBar
                      newestOnTop={false}
                      closeOnClick={false}
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      theme="dark"
                      transition={Slide}
                    />
                  </StyledLayout>
                </BALWidgetProvider>
              </ThemeProvider>
            </LayoutProvider>
          </StyledComponentsRegistry>
        </DsfrProvider>
      </body>
    </html>
  )
}
