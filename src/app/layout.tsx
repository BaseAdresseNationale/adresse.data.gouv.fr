import { DsfrHead } from '@codegouvfr/react-dsfr/next-appdir/DsfrHead'
import { DsfrProvider } from '@codegouvfr/react-dsfr/next-appdir/DsfrProvider'
import { getHtmlAttributes } from '@codegouvfr/react-dsfr/next-appdir/getHtmlAttributes'
import { StartDsfr } from './StartDsfr'
import { defaultColorScheme } from './defaultColorScheme'
import Link from 'next/link'

export default function RootLayout({ children }: { children: JSX.Element }) {
  // NOTE: The lang parameter is optional and defaults to "fr"
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
        <DsfrProvider lang={lang}>{children}</DsfrProvider>
      </body>
    </html>
  )
}
