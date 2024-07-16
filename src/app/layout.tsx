import Link from 'next/link'
import { DsfrHead } from '@codegouvfr/react-dsfr/next-appdir/DsfrHead'
import { DsfrProvider } from '@codegouvfr/react-dsfr/next-appdir/DsfrProvider'
import { getHtmlAttributes } from '@codegouvfr/react-dsfr/next-appdir/getHtmlAttributes'

import StartDsfr from '@/layouts/StartDsfr'
import Header from '@/layouts/Header'
import Footer from '@/layouts/Footer'
import { defaultColorScheme } from '@/theme/defaultColorScheme'

import styles from './layout.module.css'

import './globals.css'

export default function RootLayout({ children }: { children: JSX.Element }) {
  const lang = 'fr'

  return (
    <html {...getHtmlAttributes({ defaultColorScheme, lang })}>
      <head>
        <StartDsfr />
        <DsfrHead
          Link={Link}
          preloadFonts={[
            // "Marianne-Light",
            // "Marianne-Light_Italic",
            'Marianne-Regular',
            // "Marianne-Regular_Italic",
            'Marianne-Medium',
            // "Marianne-Medium_Italic",
            'Marianne-Bold',
            // "Marianne-Bold_Italic",
            // "Spectral-Regular",
            // "Spectral-ExtraBold"
          ]}
        />
      </head>
      <body>
        <DsfrProvider lang={lang}>
          <div className={styles.layoutWrapper}>
            <Header />
            <div className={styles.pageWrapper}>{children}</div>
            <Footer />
          </div>
        </DsfrProvider>
      </body>
    </html>
  )
}
