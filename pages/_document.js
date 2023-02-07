import Document, {Head, Html, Main, NextScript} from 'next/document'
import {dsfrDocumentApi} from './_app'

const PIWIK_URL = process.env.NEXT_PUBLIC_PIWIK_URL
const PIWIK_SITE_ID = process.env.NEXT_PUBLIC_PIWIK_SITE_ID

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
        {PIWIK_URL && PIWIK_SITE_ID && <script defer async src={`${PIWIK_URL}/piwik.js`} />}
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
