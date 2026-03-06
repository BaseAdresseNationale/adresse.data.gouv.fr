import { Html, Head, Main, NextScript, DocumentProps } from 'next/document'
import { dsfrDocumentApi } from './_app'

const {
  getColorSchemeHtmlAttributes,
  augmentDocumentForDsfr,
} = dsfrDocumentApi

export default function Document(props: DocumentProps) {
  return (
    <Html {...getColorSchemeHtmlAttributes(props)}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

augmentDocumentForDsfr(Document)
