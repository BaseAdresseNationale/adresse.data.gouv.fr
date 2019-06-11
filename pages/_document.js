import React from 'react'
import Document, {Head, Main, NextScript} from 'next/document'
import getConfig from 'next/config'

const {publicRuntimeConfig: {
  PIWIK_URL,
  PIWIK_SITE_ID
}} = getConfig()

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return {...initialProps}
  }

  render() {
    return (
      <html lang='fr'>
        <Head>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta httpEquiv='x-ua-compatible' content='ie=edge' />

          <link href='https://unpkg.com/template.data.gouv.fr@1.2.1/dist/main.min.css' rel='stylesheet' />

          <link rel='icon' href='/static/favicon.ico' />
        </Head>

        <body>
          <Main />
          <script src='https://cdn.polyfill.io/v2/polyfill.min.js?features=Array.prototype.includes,modernizr:es6string,modernizr:es6array,Promise,fetch' />
          {PIWIK_URL && PIWIK_SITE_ID && <script defer async src={`${PIWIK_URL}/piwik.js`} />}
          <NextScript />
        </body>
      </html>
    )
  }
}

export default MyDocument
