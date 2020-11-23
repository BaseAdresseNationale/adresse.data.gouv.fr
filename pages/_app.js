import React from 'react'
import App from 'next/app'

const PIWIK_URL = process.env.NEXT_PUBLIC_PIWIK_URL
const PIWIK_SITE_ID = process.env.NEXT_PUBLIC_PIWIK_SITE_ID

class MyApp extends App {
  static async getInitialProps({Component, ctx}) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return {pageProps}
  }

  logPageView() {
    if (window.Piwik) {
      const tracker = window.Piwik.getTracker(`${PIWIK_URL}/piwik.php`, PIWIK_SITE_ID)

      if (tracker) {
        tracker.trackPageView()
      }
    }
  }

  componentDidMount() {
    this.logPageView()
  }

  componentDidUpdate() {
    setTimeout(() => {
      this.logPageView()
    }, 400)
  }

  render() {
    const {Component, pageProps} = this.props

    return <Component {...pageProps} />
  }
}

export default MyApp
