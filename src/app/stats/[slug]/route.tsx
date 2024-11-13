import type { NextRequest, NextResponse } from 'next/server'
import {
  matomoToVisitData,
  matomoDailyDownloadToData,
  matomoToLookupMonthlyUsage,
  getMonthlyUsageData,
  getQualityData,
} from '../utils/helper'
import {
  defDataMonthlyLookup,
  defDataBanVisit,
  defDataDailyDownload,
} from '../utils/stats-config-data'

const {
  NEXT_PUBLIC_MATOMO_URL,
  NEXT_PUBLIC_MATOMO_SITE_ID,
} = process.env

if (!NEXT_PUBLIC_MATOMO_URL || !NEXT_PUBLIC_MATOMO_SITE_ID) {
  throw new Error('MATOMO_URL and MATOMO_ID is not defined in the environment')
}

const URL_GET_STATS_MONTHLY_DOWNLOAD = `${NEXT_PUBLIC_MATOMO_URL}/index.php?idSite=${NEXT_PUBLIC_MATOMO_SITE_ID}&module=API&format=JSON&period=month&date=previous12&method=Events.getCategory&filter_pattern=^download&format_metrics=1&expanded=1`
const URL_GET_STATS_MONTHLY_LOOKUP = `${NEXT_PUBLIC_MATOMO_URL}/index.php?idSite=${NEXT_PUBLIC_MATOMO_SITE_ID}&module=API&format=JSON&period=month&date=previous12&method=Events.getAction&label=Lookup&filter_limit=-1&format_metrics=1&expanded=1`
const URL_GET_STATS_DAILY_DOWNLOAD = `${NEXT_PUBLIC_MATOMO_URL}/index.php?idSite=${NEXT_PUBLIC_MATOMO_SITE_ID}&module=API&format=JSON&period=day&date=previous30&method=Events.getCategory&expanded=1&filter_limit=10`
const URL_GET_STATS_DAILY_LOOKUP = `${NEXT_PUBLIC_MATOMO_URL}/index.php?idSite=${NEXT_PUBLIC_MATOMO_SITE_ID}&module=API&format=JSON&period=day&date=previous30&method=Events.getAction&expanded=1&filter_limit=10&filter_pattern=^Lookup`
const URL_GET_STAT_VISIT = `${NEXT_PUBLIC_MATOMO_URL}/index.php?idSite=${NEXT_PUBLIC_MATOMO_SITE_ID}&module=API&format=JSON&period=month&date=previous12&method=API.get&filter_limit=100&format_metrics=1&expanded=1`

// Any : is from matomo's data extracted from helper.js
type StatValue = Record<string, any>

type Converter = (data: object) => Promise<object> | object

interface DataResponse {
  url?: string | URL | Request | undefined
  getter?: () => Promise< StatValue[] | { period: string, value: StatValue[] } > | (StatValue[] | { period: string, value: StatValue[] })
  converter?: Converter
  data?: object
}

const APIs: Record<string, DataResponse> = {
  'monthly-usage': { getter: getMonthlyUsageData([URL_GET_STATS_MONTHLY_DOWNLOAD, URL_GET_STATS_MONTHLY_LOOKUP]) },
  'daily-lookup': { url: URL_GET_STATS_DAILY_LOOKUP, converter: matomoToLookupMonthlyUsage(defDataMonthlyLookup) },
  'daily-download': { url: URL_GET_STATS_DAILY_DOWNLOAD, converter: matomoDailyDownloadToData(defDataDailyDownload) },
  'visit': { url: URL_GET_STAT_VISIT, converter: matomoToVisitData(defDataBanVisit) },
  'quality': { getter: getQualityData },
}

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const res = Response
  const slug = params.slug
  try {
    const { url, getter, data: dataRaw, converter = (d: object) => d }: DataResponse = APIs?.[slug] || {}

    if (getter) {
      const data = await converter(await getter())
      return res.json(data, { status: 200 })
    }

    if (dataRaw) {
      const data = await converter(dataRaw)
      return res.json(data, { status: 200 })
    }

    if (url) {
      const response = await fetch(url)
      const { status } = response
      const validStatus = [200, 304]
      if (!validStatus.includes(status)) {
        throw new Error('API not found 2', { cause: { details: 'Error while fetching API', status } })
      }

      const data = await converter(await response.json())
      return res.json(data, { status: 200 })
    }

    throw new Error('API not found ', { cause: { details: 'API not found', status: 404 } })
  }
  catch (error) {
    const { message, cause } = error as Error
    console.error('Error on Front-end Stat API :', message, cause, error)
    return new res(message || 'Internal server error', { status: ((cause as any)?.status || 500) })
  }
}
