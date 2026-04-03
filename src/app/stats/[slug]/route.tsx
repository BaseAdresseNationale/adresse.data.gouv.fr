import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
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

// Any : is from matomo's data extracted from helper.js
type StatValue = Record<string, any>

type Converter = (data: object) => Promise<object> | object

interface DataResponse {
  url?: string | URL | Request | undefined
  getter?: () => Promise<StatValue[] | { period: string, value: StatValue[] }> | (StatValue[] | { period: string, value: StatValue[] })
  converter?: Converter
  data?: object
}

const emptyMonthlyUsage = { period: '', value: [] }
const emptySeries: any[] = []

function normalizeEnvValue(value?: string) {
  return value?.trim() || ''
}

function isPlaceholderEnvValue(value: string) {
  return value.startsWith('YOUR_') || value.includes('YOUR_NEXT_PUBLIC_')
}

function isValidMatomoBaseUrl(value: string) {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  }
  catch {
    return false
  }
}

function getMatomoUrls() {
  const NEXT_PUBLIC_MATOMO_URL = normalizeEnvValue(process.env.NEXT_PUBLIC_MATOMO_URL)
  const NEXT_PUBLIC_MATOMO_SITE_ID = normalizeEnvValue(process.env.NEXT_PUBLIC_MATOMO_SITE_ID)
  const MATOMO_TOKEN_AUTH = normalizeEnvValue(process.env.MATOMO_TOKEN_AUTH)

  if (!NEXT_PUBLIC_MATOMO_URL || !NEXT_PUBLIC_MATOMO_SITE_ID || !MATOMO_TOKEN_AUTH) {
    return null
  }

  if (
    isPlaceholderEnvValue(NEXT_PUBLIC_MATOMO_URL)
    || isPlaceholderEnvValue(NEXT_PUBLIC_MATOMO_SITE_ID)
    || isPlaceholderEnvValue(MATOMO_TOKEN_AUTH)
    || !isValidMatomoBaseUrl(NEXT_PUBLIC_MATOMO_URL)
  ) {
    return null
  }

  const baseUrl = new URL('/index.php', NEXT_PUBLIC_MATOMO_URL)
  const buildMatomoUrl = (params: Record<string, string>) => {
    const url = new URL(baseUrl.toString())
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
    return url.toString()
  }

  const defaultParams = {
    idSite: NEXT_PUBLIC_MATOMO_SITE_ID,
    token_auth: MATOMO_TOKEN_AUTH,
    module: 'API',
    format: 'JSON',
  }

  const URL_GET_STATS_MONTHLY_DOWNLOAD = buildMatomoUrl({
    ...defaultParams,
    period: 'month',
    date: 'previous12',
    method: 'Events.getCategory',
    filter_pattern: '^download',
    format_metrics: '1',
    expanded: '1',
  })
  const URL_GET_STATS_MONTHLY_LOOKUP = buildMatomoUrl({
    ...defaultParams,
    period: 'month',
    date: 'previous12',
    method: 'Events.getAction',
    label: 'Lookup',
    filter_limit: '-1',
    format_metrics: '1',
    expanded: '1',
  })
  const URL_GET_STATS_DAILY_DOWNLOAD = buildMatomoUrl({
    ...defaultParams,
    period: 'day',
    date: 'previous30',
    method: 'Events.getCategory',
    expanded: '1',
    filter_limit: '10',
  })
  const URL_GET_STATS_DAILY_LOOKUP = buildMatomoUrl({
    ...defaultParams,
    period: 'day',
    date: 'previous30',
    method: 'Events.getAction',
    expanded: '1',
    filter_limit: '10',
    filter_pattern: '^Lookup',
  })
  const URL_GET_STAT_VISIT = buildMatomoUrl({
    ...defaultParams,
    period: 'month',
    date: 'previous12',
    method: 'API.get',
    filter_limit: '100',
    format_metrics: '1',
    expanded: '1',
  })

  return {
    URL_GET_STATS_MONTHLY_DOWNLOAD,
    URL_GET_STATS_MONTHLY_LOOKUP,
    URL_GET_STATS_DAILY_DOWNLOAD,
    URL_GET_STATS_DAILY_LOOKUP,
    URL_GET_STAT_VISIT,
  }
}

function getApis(): Record<string, DataResponse> {
  const matomoUrls = getMatomoUrls()

  if (!matomoUrls) {
    return {
      'monthly-usage': { data: emptyMonthlyUsage },
      'daily-lookup': { data: emptySeries },
      'daily-download': { data: emptySeries },
      'visit': { data: emptySeries },
      'quality': { getter: getQualityData },
    }
  }

  return {
    'monthly-usage': { getter: getMonthlyUsageData([matomoUrls.URL_GET_STATS_MONTHLY_DOWNLOAD, matomoUrls.URL_GET_STATS_MONTHLY_LOOKUP]) },
    'daily-lookup': { url: matomoUrls.URL_GET_STATS_DAILY_LOOKUP, converter: matomoToLookupMonthlyUsage(defDataMonthlyLookup) },
    'daily-download': { url: matomoUrls.URL_GET_STATS_DAILY_DOWNLOAD, converter: matomoDailyDownloadToData(defDataDailyDownload) },
    'visit': { url: matomoUrls.URL_GET_STAT_VISIT, converter: matomoToVisitData(defDataBanVisit) },
    'quality': { getter: getQualityData },
  }
}

export async function GET(_req: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const slug = params.slug
  const APIs = getApis()
  try {
    const { url, getter, data: dataRaw, converter = (d: object) => d }: DataResponse = APIs?.[slug] || {}

    if (getter) {
      const data = await converter(await getter())
      return NextResponse.json(data, { status: 200 })
    }

    if (dataRaw) {
      const data = await converter(dataRaw)
      return NextResponse.json(data, { status: 200 })
    }

    if (url) {
      const response = await fetch(url, { cache: 'force-cache' })
      const { status } = response
      const validStatus = [200, 304]
      if (!validStatus.includes(status)) {
        throw new Error('API not found 2', { cause: { details: 'Error while fetching API', status } })
      }

      const data = await converter(await response.json())
      return NextResponse.json(data, { status: 200 })
    }

    throw new Error('API not found ', { cause: { details: 'API not found', status: 404 } })
  }
  catch (error) {
    const { message, cause } = error as Error
    console.error('Error on Front-end Stat API :', message, cause, error)
    return NextResponse.json({ error: message || 'Internal server error' }, { status: ((cause as any)?.status || 500) })
  }
}
