// CF. Tracking HTTP API documentation :
// https://developer.matomo.org/api-reference/tracking-api

import os from 'node:os'
import { env } from 'next-runtime-env'

const ADRESSE_URL = env('NEXT_PUBLIC_ADRESSE_URL')
const MATOMO_URL = env('NEXT_PUBLIC_MATOMO_URL')
const MATOMO_SITE_ID = env('NEXT_PUBLIC_MATOMO_SITE_ID')
const MATOMO_TOKEN_AUTH = env('MATOMO_TOKEN_AUTH')
const NODE_ENV = env('NODE_ENV')
const IS_DEV_MODE = NODE_ENV !== 'production'

const logMatomoError = (err: Error) => {
  console.log('error tracking request:', err)
}

type TypeParams = Record<string, string | number | boolean>
const encodeParams = (params: TypeParams = {}): Record<string, string> => Object.fromEntries(
  Object
    .entries(params || {})
    .map(([key, value]) => [key, encodeURIComponent(String(value))]),
)

interface TrackEvent {
  category: string
  action: string
  name: string
  value?: number
}
export const getTrackEvent = ({ category, action, name, value = 1 }: TrackEvent) => {
  const isDevMode = IS_DEV_MODE

  return {
    e_c: `${isDevMode ? 'DEVMODE - ' : ''}${category}`, // Category name
    e_a: action, // Action name
    e_n: name, // Name
    e_v: value, // Value
  }
}

interface DownloadToEventTracker {
  downloadDataType: string
  downloadFileName: string
  nbDownload?: number
}
export const getDownloadToEventTracker = ({
  downloadDataType,
  downloadFileName,
  nbDownload = 1,
}: DownloadToEventTracker) => {
  const url = `${ADRESSE_URL || '.'}/data/${downloadFileName || ''}`

  return {
    url,
    trackEvent: {
      category: 'Download',
      action: `Download Data ${downloadDataType}`,
      name: downloadFileName,
      value: nbDownload,
    },
  }
}

interface TrackerParams {
  url?: string
  ua?: string
  download?: string
  trackEvent?: TrackEvent
  [key: string]: any
}

export const sendToTracker = async (params: TrackerParams = {}) => {
  const { url, ua, download, trackEvent, ...otherParams } = params

  const requiredParams = {
    idsite: MATOMO_SITE_ID || '',
    rec: 1,
    ua: ua || `${os.hostname()} / Node.JS ${process.version} / ${os.version()}`,
    ...(MATOMO_TOKEN_AUTH ? { token_auth: MATOMO_TOKEN_AUTH } : {}),
  }
  const urlSearchParams = new URLSearchParams(
    encodeParams({
      ...requiredParams,
      ...otherParams,
      ...(url ? { url } : {}),
      ...(download ? { download } : {}),
      ...(trackEvent ? getTrackEvent(trackEvent) : {}),
    })
  ).toString()

  const matomoUrl = `${MATOMO_URL}/matomo.php${urlSearchParams ? `?${urlSearchParams}` : ''}`

  try {
    const sentToMatomoWithHTTP = await fetch(matomoUrl, { method: 'POST' })

    if (sentToMatomoWithHTTP.status !== 200) {
      throw new Error(`Matomo HTTP API returned ${sentToMatomoWithHTTP.status}`)
    }
  }
  catch (error) {
    logMatomoError(error as Error)
  }
}

export default sendToTracker
