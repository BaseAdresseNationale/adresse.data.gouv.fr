'use client'

import Link from 'next/link'
import { DsfrHead } from '@codegouvfr/react-dsfr/next-appdir/DsfrHead'
import { DsfrProvider } from '@codegouvfr/react-dsfr/next-appdir/DsfrProvider'
import { getHtmlAttributes } from '@codegouvfr/react-dsfr/next-appdir/getHtmlAttributes'

import StartDsfr from '@/layouts/StartDsfr'
import Header from '@/layouts/Header'
import Footer from '@/layouts/Footer'
import { defaultColorScheme } from '@/theme/defaultColorScheme'
import styled, { ThemeProvider } from 'styled-components'
import StyledComponentsRegistry from '@/styled-components/registry'
import theme from '@/styled-components/theme'
import GlobalStyle from './global.styles'

const StyledLayout = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;

  .pageWrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`

export default function RootLayout({ children }: { children: JSX.Element }) {
  const lang = 'fr'

  return (
    <html {...getHtmlAttributes({ defaultColorScheme, lang })}>
      <head>
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
              <GlobalStyle />
              <StyledLayout>
                <Header />
                <div className="pageWrapper">{children}</div>
                <Footer />
              </StyledLayout>
            </ThemeProvider>
          </StyledComponentsRegistry>
        </DsfrProvider>
      </body>
    </html>
  )
}
