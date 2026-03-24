import type { AppProps } from 'next/app'
import { createNextDsfrIntegrationApi } from '@codegouvfr/react-dsfr/next-pagesdir'
import { ThemeProvider } from 'styled-components'
import Link from 'next/link'

import StyledComponentsRegistry from '@/providers/StyledComponentsRegistry'
import Header from '@/layouts/Header'
import Footer from '@/layouts/Footer'
import { LayoutProvider } from '@/layouts/MainLayout'
import theme from '@/theme'

declare module '@codegouvfr/react-dsfr/next-pagesdir' {
  interface RegisterLink {
    Link: typeof Link
  }
}

const {
  withDsfr,
  dsfrDocumentApi,
} = createNextDsfrIntegrationApi({
  defaultColorScheme: 'system',
  Link,
})

export { dsfrDocumentApi }

function App({ Component, pageProps }: AppProps) {
  return (
    <StyledComponentsRegistry>
      <LayoutProvider>
        <ThemeProvider theme={theme}>
          <>
            <Header notices={{ data: [], duration: 4000 }} />
            <Component {...pageProps} />
            <Footer />
          </>
        </ThemeProvider>
      </LayoutProvider>
    </StyledComponentsRegistry>
  )
}

export default withDsfr(App)
