import Link from 'next/link'
import { DsfrHeadBase as DsfrHead } from '@codegouvfr/react-dsfr/next-app-router/DsfrHead'
import { createGetHtmlAttributes } from '@codegouvfr/react-dsfr/next-app-router/getHtmlAttributes'
import { defaultColorScheme } from '@/theme/defaultColorScheme'
import type { ReactNode } from 'react'
import { PublicEnvScript } from 'next-runtime-env'
import LayoutClient from './layout-client'

export default function RootLayout({ children }: { children: ReactNode }) {
  const lang = 'fr'
  const { getHtmlAttributes } = createGetHtmlAttributes({ defaultColorScheme })

  return (
    <html {...getHtmlAttributes({ lang })}>
      <head>
        <PublicEnvScript />
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
        <LayoutClient lang={lang}>{children}</LayoutClient>
      </body>
    </html>
  )
}
