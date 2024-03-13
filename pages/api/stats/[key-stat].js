import {
  matomoToVisitData,
  matomoDailyDownloadToData,
  matomoToLookupMonthlyUsage,
  getMonthlyUsageData,
  getQualityData,
} from '@/views/stats/helper'
import {
  defDataMonthlyLookup,
  defDataBanVisit,
  defDataDailyDownload,
} from '@/views/stats/stats-config-data'

const {
  NEXT_PUBLIC_MATOMO_URL: MATOMO_URL,
  NEXT_PUBLIC_MATOMO_SITE_ID: MATOMO_ID,
  MATOMO_TOKEN_AUTH = '',
} = process.env

const URL_GET_STATS_MONTHLY_DOWNLOAD = `${MATOMO_URL}/index.php?idSite=${MATOMO_ID}&module=API&format=JSON&period=month&date=previous12&method=Events.getCategory&filter_pattern=^download&format_metrics=1&expanded=1&token_auth=${MATOMO_TOKEN_AUTH}`
const URL_GET_STATS_MONTHLY_LOOKUP = `${MATOMO_URL}/index.php?idSite=${MATOMO_ID}&module=API&format=JSON&period=month&date=previous12&method=Events.getAction&label=Lookup&filter_limit=-1&format_metrics=1&expanded=1&token_auth=${MATOMO_TOKEN_AUTH}`
const URL_GET_STATS_DAILY_DOWNLOAD = `${MATOMO_URL}/index.php?idSite=${MATOMO_ID}&module=API&format=JSON&period=day&date=previous30&method=Events.getCategory&expanded=1&filter_limit=10&token_auth=${MATOMO_TOKEN_AUTH}`
const URL_GET_STATS_DAILY_LOOKUP = `${MATOMO_URL}/index.php?idSite=${MATOMO_ID}&module=API&format=JSON&period=day&date=previous30&method=Events.getAction&expanded=1&filter_limit=10&filter_pattern=^Lookup&token_auth=${MATOMO_TOKEN_AUTH}`
const URL_GET_STAT_VISIT = `${MATOMO_URL}/index.php?idSite=${MATOMO_ID}&module=API&format=JSON&period=month&date=previous12&method=API.get&filter_limit=100&format_metrics=1&expanded=1&token_auth=${MATOMO_TOKEN_AUTH}`

const APIs = {
  'monthly-usage': {getter: getMonthlyUsageData([URL_GET_STATS_MONTHLY_DOWNLOAD, URL_GET_STATS_MONTHLY_LOOKUP])},
  'daily-lookup': {url: URL_GET_STATS_DAILY_LOOKUP, converter: matomoToLookupMonthlyUsage(defDataMonthlyLookup)},
  'daily-download': {url: URL_GET_STATS_DAILY_DOWNLOAD, converter: matomoDailyDownloadToData(defDataDailyDownload)},
  visit: {url: URL_GET_STAT_VISIT, converter: matomoToVisitData(defDataBanVisit)},
  quality: {getter: getQualityData},
}

export default async function handler(req, res) {
  const {'key-stat': keyStat} = req.query

  try {
    const {url, getter, data: dataRaw, converter = d => d} = APIs?.[keyStat] || {}
    if (!url && !dataRaw && !getter) {
      throw new Error('API not found', {status: 404, cause: {details: 'API not found', status: 404}})
    }

    if (getter) {
      const data = await converter(await getter())
      return res.status(200).json(data)
    }

    if (dataRaw) {
      const data = await converter(dataRaw)
      return res.status(200).json(data)
    }

    const response = await fetch(url)
    const {status} = response
    const validStatus = [200, 304]
    if (!validStatus.includes(status)) {
      throw new Error('API not found', {cause: {details: 'Error while fetching API', status}})
    }

    const data = await converter(await response.json())
    res.status(status).json(data)
  } catch (error) {
    const {message, cause} = error
    console.error('Error on Front-end Stat API :', message, cause, error)
    res.status(cause?.status || 500).send(message || 'Internal server error')
  }
}
