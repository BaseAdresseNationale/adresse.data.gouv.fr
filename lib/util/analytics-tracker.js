/* eslint-disable camelcase */

import MatomoTracker from 'matomo-tracker'

const isDevMode = () => process.env?.NODE_ENV !== 'production'

const getAnalyticsTracker = () => {
  const {
    NEXT_PUBLIC_MATOMO_URL,
    NEXT_PUBLIC_MATOMO_SITE_ID: MATOMO_SITE_ID,
  } = process.env
  const MATOMO_URL = NEXT_PUBLIC_MATOMO_URL && `${NEXT_PUBLIC_MATOMO_URL}/matomo.php`
  const DEVMODE = isDevMode()

  const matomoDevLog = tracker => {
    console.info('[ANALYTICS-DEVLOG] Init matomo')
    return (data, callback) => {
      if (tracker && tracker.track) {
        tracker.track(data, callback)
      }
    }
  }

  const matomoErrorDevLog = err => {
    console.warn('[ANALYTICS-DEVLOG-ERROR] Error on init matomo:', err)
    return data => {
      console.warn('[ANALYTICS-DEVLOG-ERROR] NOT Push to Matomo:', data)
    }
  }

  const logMatomoError = err => {
    console.error('[ANALYTICS-ERROR] error tracking request:', err)
  }

  try {
    const tracker = new MatomoTracker(MATOMO_SITE_ID, MATOMO_URL)
    tracker.on('error', logMatomoError)
    return DEVMODE ? {track: matomoDevLog(tracker)} : tracker
  } catch (error) {
    return {track: matomoErrorDevLog(error)}
  }
}

export const getDownloadTrackData = ({
  downloadDataType,
  downloadFileName,
  nbDownload = 1,
}) => {
  const DEVMODE = isDevMode()

  // CF. Tracking HTTP API documentation :
  // https://developer.matomo.org/api-reference/tracking-api

  return {
    url: `/data/${downloadFileName || ''}`,
    download: `/data/${downloadFileName || ''}`,
    e_c: `${DEVMODE ? 'DEVMODE - ' : ''}Download`,
    e_a: `Download Data ${downloadDataType}`, // Type de download
    e_n: downloadFileName, // FileName
    e_v: nbDownload, // Nb download
  }
}

export const getAnalyticsPusher = () => {
  const DEVMODE = isDevMode()
  const matomo = getAnalyticsTracker()
  return analyticsTrackData => {
    matomo.track(analyticsTrackData, (err, response) => {
      if (err) {
        console.error('[ANALYTICS-ERROR] Matomo tracking error:', err)
      } else if (DEVMODE) {
        console.log('[ANALYTICS-DEVLOG] Matomo Event trackin:', response)
      }
    })
  }
}

export default getAnalyticsPusher
