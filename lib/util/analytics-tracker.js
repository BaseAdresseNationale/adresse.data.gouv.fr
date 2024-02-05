/* eslint-disable camelcase */
// CF. Tracking HTTP API documentation :
// https://developer.matomo.org/api-reference/tracking-api

import os from 'node:os'
import getConfig from 'next/config'

const logMatomoError = err => {
  console.log('error tracking request:', err)
}

const encodeParams = params => Object.fromEntries(
  Object
    .entries(params || {})
    .map(([key, value]) => [key, typeof value === 'string' ? encodeURIComponent(value) : value]),
)

export const getTrackEvent = ({category, action, name, value = 1}) => {
  const {isDevMode} = getConfig().publicRuntimeConfig

  return {
    e_c: `${isDevMode ? 'DEVMODE - ' : ''}${category}`, // Category name
    e_a: action, // Action name
    e_n: name, // Name
    e_v: value, // Value
  }
}

export const getDownloadToEventTracker = ({
  downloadDataType,
  downloadFileName,
  nbDownload = 1,
}) => {
  const {NEXT_PUBLIC_ADRESSE_URL} = process.env
  const url = `${NEXT_PUBLIC_ADRESSE_URL}/data/${downloadFileName || ''}`

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

export const sendToTracker = async (params = {}) => {
  const {url, ua, download, trackEvent, ...otherParams} = params
  const {
    NEXT_PUBLIC_MATOMO_URL: MATOMO_URL,
    NEXT_PUBLIC_MATOMO_SITE_ID: MATOMO_SITE_ID,
    MATOMO_TOKEN_AUTH,
  } = process.env

  const requiredParams = {
    idsite: MATOMO_SITE_ID,
    rec: 1,
    ua: ua || `${os.hostname()} / Node.JS ${process.version} / ${os.version()}`,
    ...(MATOMO_TOKEN_AUTH ? {token_auth: MATOMO_TOKEN_AUTH} : {}),
  }
  const urlSearchParams = new URLSearchParams(
    encodeParams({
      ...requiredParams,
      ...otherParams,
      ...(url ? {url} : {}),
      ...(download ? {download} : {}),
      ...(trackEvent ? getTrackEvent(trackEvent) : {}),
    })
  ).toString()

  const matomoUrl = `${MATOMO_URL}/matomo.php${urlSearchParams ? `?${urlSearchParams}` : ''}`

  try {
    const sentToMatomoWithHTTP = await fetch(matomoUrl, {method: 'POST'})

    if (sentToMatomoWithHTTP.status !== 200) {
      throw new Error(`Matomo HTTP API returned ${sentToMatomoWithHTTP.status}`)
    }
  } catch (error) {
    logMatomoError(error)
  }
}

export default sendToTracker

