import Document, {Head, Html, Main, NextScript} from 'next/document'

const PIWIK_URL = process.env.NEXT_PUBLIC_PIWIK_URL
const PIWIK_SITE_ID = process.env.NEXT_PUBLIC_PIWIK_SITE_ID

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return {...initialProps}
  }

  render() {
    return (
      <Html lang='fr'>
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
}

export default MyDocument
