import type { AppProps } from 'next/app'
import { createNextDsfrIntegrationApi } from '@codegouvfr/react-dsfr/next-pagesdir'
import { ThemeProvider } from 'styled-components'
import Link from 'next/link'

import StyledComponentsRegistry from '@/providers/StyledComponentsRegistry'
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
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </StyledComponentsRegistry>
  )
}

export default withDsfr(App)
