import { Html, Head, Main, NextScript, DocumentProps } from 'next/document'
import { dsfrDocumentApi } from './_app'
import Layout from '@/app/layout'

const {
  getColorSchemeHtmlAttributes,
  augmentDocumentForDsfr,
} = dsfrDocumentApi

export default function Document(props: DocumentProps) {
  return (
    <Html {...getColorSchemeHtmlAttributes(props)}>
      <Head />
      <Layout>
        <body>
          <Main />
          <NextScript />
        </body>
      </Layout>
    </Html>
  )
}

augmentDocumentForDsfr(Document)
