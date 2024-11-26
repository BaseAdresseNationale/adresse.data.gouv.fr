'use client'

import Link from 'next/link'
import { DsfrHead } from '@codegouvfr/react-dsfr/next-appdir/DsfrHead'
import { DsfrProvider } from '@codegouvfr/react-dsfr/next-appdir/DsfrProvider'
import { getHtmlAttributes } from '@codegouvfr/react-dsfr/next-appdir/getHtmlAttributes'

import { StartDsfr } from '@/providers'
import Header from '@/layouts/Header'
import Footer from '@/layouts/Footer'
import Breadcrumb from '@/layouts/Breadcrumb'
import { defaultColorScheme } from '@/theme/defaultColorScheme'
import styled, { ThemeProvider } from 'styled-components'
import StyledComponentsRegistry from '@/providers/StyledComponentsRegistry'
import theme from '@/theme'
import GlobalStyle from './global.styles'
import { useEffect } from 'react'
import { init as matomoInit } from '@socialgouv/matomo-next'
import { BALWidgetProvider } from '@/contexts/BALWidget.context'
import { PublicEnvScript, env } from 'next-runtime-env'

const StyledLayout = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto auto 1fr auto;

  .pageWrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`

export default function RootLayout({ children }: { children: JSX.Element }) {
  const lang = 'fr'

  const dataNotices = {
    data: [],
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
            <ThemeProvider theme={theme}>
              <BALWidgetProvider>
                <GlobalStyle />
                <StyledLayout>
                  <Header notices={dataNotices} />
                  <div className="pageWrapper">
                    {/* <Breadcrumb /> */}
                    {children}
                  </div>
                  <Footer />
                </StyledLayout>
              </BALWidgetProvider>
            </ThemeProvider>
          </StyledComponentsRegistry>
        </DsfrProvider>
      </body>
    </html>
  )
}
