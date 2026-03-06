'use client'

import { useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import { ToastContainer, Slide } from 'react-toastify'
import { DsfrProviderBase as DsfrProvider } from '@codegouvfr/react-dsfr/next-app-router/DsfrProvider'
import { StartDsfrOnHydration } from '@codegouvfr/react-dsfr/next-app-router'
import { init as matomoInit } from '@socialgouv/matomo-next'
import { env } from 'next-runtime-env'
import { ThemeProvider } from 'styled-components'

import { LayoutProvider } from '@/layouts/MainLayout'
import Header from '@/layouts/Header'
import Footer from '@/layouts/Footer'
import { BALWidgetProvider } from '@/contexts/BALWidget.context'
import StyledComponentsRegistry from '@/providers/StyledComponentsRegistry'
import theme from '@/theme'
import { defaultColorScheme } from '@/theme/defaultColorScheme'
import GlobalStyle from './global.styles'
import { StyledLayout, PageWrapper } from './layout.styles'

interface LayoutClientProps {
  children: ReactNode
  lang: string
}

export default function LayoutClient({ children, lang }: LayoutClientProps) {
  const dataNotices = {
    data: [],
    duration: 4000,
  }

  useEffect(() => {
    const matomoUrl = env('NEXT_PUBLIC_MATOMO_URL')
    const siteId = env('NEXT_PUBLIC_MATOMO_SITE_ID')

    if (!matomoUrl || !siteId) {
      return
    }

    matomoInit({ url: matomoUrl, siteId })
  }, [])

  return (
    <DsfrProvider defaultColorScheme={defaultColorScheme} Link={Link} lang={lang}>
      <StartDsfrOnHydration />
      <StyledComponentsRegistry>
        <LayoutProvider>
          <ThemeProvider theme={theme}>
            <BALWidgetProvider>
              <GlobalStyle />
              <StyledLayout>
                <Header notices={dataNotices} />
                <PageWrapper>{children}</PageWrapper>
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
  )
}
