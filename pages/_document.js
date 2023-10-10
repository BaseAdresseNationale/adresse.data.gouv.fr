import Document, {Head, Html, Main, NextScript} from 'next/document'
import {dsfrDocumentApi} from './_app'

const {getColorSchemeHtmlAttributes, augmentDocumentForDsfr} = dsfrDocumentApi

export default function MyDocument(props) {
  return (
    <Html lang='fr' {...getColorSchemeHtmlAttributes(props)}>
      <Head>
        <meta httpEquiv='x-ua-compatible' content='ie=edge' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

MyDocument.getInitialProps = async ctx => {
  const initialProps = await Document.getInitialProps(ctx)
  return {...initialProps}
}

augmentDocumentForDsfr(MyDocument)
