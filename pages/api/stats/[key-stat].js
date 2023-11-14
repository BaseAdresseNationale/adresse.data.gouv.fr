import {
  matomoToVisitData,
  matomoDailyToData,
  matomoMonthlyToData,
  geocoderSearchToData,
} from '@/views/stats/helper'

const {
  NEXT_PUBLIC_MATOMO_URL: MATOMO_URL,
  NEXT_PUBLIC_MATOMO_SITE_ID: MATOMO_ID,
  MATOMO_TOKEN_AUTH,
} = process.env

const fakeDataQualityScore = {
  0: 39,
  1: 9,
  2: 22,
  3: 19,
  4: 2,
  5: 9
}

const matomoToFakeGeocodeurData = (matomoData = {}) => Object.entries(matomoData)
  .map(([dataDate, dataStat]) => {
    const filtredDataStat = dataStat.filter((dataStatItem = {}) => /^download/i.test(dataStatItem.label))
    return [dataDate, filtredDataStat]
  })
  .map(([dataDate, dataStat]) => {
    const convertToFakeLabel = {
      'download BAL': ['nbSearch', 'nbReverseSearch'],
      'Download BAL': ['nbSearch', 'nbReverseSearch'],
      'download CSV historique adresses': ['nbSearchResult', 'nbReverseSearchResult'],
      'Download CSV historique adresses': ['nbSearchResult', 'nbReverseSearchResult'],
      'download CSV historique lieux-dits': ['nbSearchEmptyResult', 'nbReverseSearchEmptyResult'],
      'Download CSV historique lieux-dits': ['nbSearchEmptyResult', 'nbReverseSearchEmptyResult'],
    }
    const finalDataStat = dataStat
      .map((dataStatItem = {}) => {
        const {subtable} = dataStatItem
        const otherFields = Object.fromEntries(
          subtable.flatMap((subtableItem = {}) => {
            const {label: subtableLabel, nb_events: subtableNbEvents} = subtableItem
            return [
              [convertToFakeLabel[subtableLabel]?.[0] || subtableLabel, (subtableNbEvents * 0)],
              [convertToFakeLabel[subtableLabel]?.[1] || subtableLabel, (subtableNbEvents * 0)]
            ]
          })
        )

        return {
          label: 'API Geocodeur Adresse',
          period: dataDate,
          ...otherFields,
        }
      })
    return finalDataStat[0]
  })

const getQualityData = dataQuality => {
  const StateBanDefs = [
    {color: '#e2d8f5', description: 'Adresses composés à partir de sources multiples (autre que BAL)'},
    {color: '#f9e7c7', description: 'Adresses issues des Bases Adresses Locales'},
    {color: '#f7c6c6', description: 'Adresses certifiées'},
    {color: '#cccccc', description: 'Total des adresses au sein de la Base Adresse National'},
  ]
  const QualityDefs = [
    {color: '#869ECE', description: 'Adresses issues de l\'assemblage de sources non certifiable'},
    {color: '#A695E7', description: 'Adresses issues de l\'assemblage de sources certifiées'},
    {color: '#3C91E6', description: 'Adresses issues d\'une Base Adresse Locale'},
    {color: '#0E6AA2', description: 'Adresses certifiées ou referençants une parcelle cadastrale'},
    {color: '#F5C242', description: 'Adresses identifiables et suivies au sein d\'une Base Adresse Locale'},
    {color: '#E65A5A', description: 'Adresses certifiées et referençants une parcelle cadastrale'},
  ]
  const DataQuality = [
    Object
      .entries(dataQuality)
      .reduce((acc, [key, value]) => { // eslint-disable-line unicorn/no-array-reduce
        let name
        switch (key) {
          case '0':
          case '1':
            name = '0'
            break
          case '2':
          case '3':
          case '4':
            name = '1'
            break
          case '5':
            name = '2'
            break
          default:
            name = 0
        }

        acc[name] = (acc[name] || 0) + value
        console.log('acc', acc)
        return acc
      }, [])
      .map((value, index) => [`${index}`, value])
      .map(
        ([name, value]) => ({
          name, value,
          color: StateBanDefs[Number(name)].color,
          description: StateBanDefs[Number(name)].description
        })
      ),
    Object
      .entries(fakeDataQualityScore)
      .map(
        ([name, value]) => ({
          name, value,
          color: QualityDefs[Number(name)].color,
          description: QualityDefs[Number(name)].description
        })
      ),
  ]
  return DataQuality
}

const getMonthlyUsageData = dataMonthlyUsage => ({
  period: dataMonthlyUsage.period,
  value: dataMonthlyUsage ? [
    {value: `${dataMonthlyUsage?.value?.nb_events || ''}`, label: 'Téléchargements', description: 'des données BAN sur nos serveurs.*', large: true},
    {value: '??', label: 'Recherche', description: 'effectuées sur notre API Geocodage-BAN.**'},
    {value: '??', label: 'Exploitants', description: 'utilisant les données de la BAN sur leurs outils.***', hasSeparator: true},
  ] : []
})

const URL_GET_STATS_DAILY_DOWNLOAD = `${MATOMO_URL}/index.php?idSite=${MATOMO_ID}&module=API&format=JSON&period=day&date=previous30&method=Events.getCategory&expanded=1&filter_limit=10&token_auth=${MATOMO_TOKEN_AUTH}`
const URL_GET_STATS_MONTHLY_DOWNLOAD = `${MATOMO_URL}/index.php?idSite=${MATOMO_ID}&module=API&format=JSON&period=month&date=previous30&method=Events.getCategory&label=download&format_metrics=1&expanded=1&token_auth=${MATOMO_TOKEN_AUTH}`
const URL_GET_STATS_GEOCODER = `${MATOMO_URL}/index.php?idSite=${MATOMO_ID}&module=API&format=JSON&period=day&date=previous30&method=Events.getCategory&expanded=1&filter_limit=10&token_auth=${MATOMO_TOKEN_AUTH}`
const URL_GET_STAT_VISIT = `${MATOMO_URL}/index.php?idSite=${MATOMO_ID}&module=API&format=JSON&period=month&date=previous12&method=API.get&filter_limit=100&format_metrics=1&expanded=1&token_auth=${MATOMO_TOKEN_AUTH}`

const APIs = {
  'daily-download': {url: URL_GET_STATS_DAILY_DOWNLOAD, converter: matomoDailyToData},
  'monthly-usage': {url: URL_GET_STATS_MONTHLY_DOWNLOAD, converter: data => getMonthlyUsageData(matomoMonthlyToData(data))},
  geocoder: {url: URL_GET_STATS_GEOCODER, converter: data => geocoderSearchToData(matomoToFakeGeocodeurData(data))},
  visit: {url: URL_GET_STAT_VISIT, converter: matomoToVisitData},
  quality: {data: fakeDataQualityScore, converter: getQualityData},
}

export default async function handler(req, res) {
  const {'key-stat': keyStat} = req.query

  try {
    const {url, data: dataRaw, converter = d => d} = APIs?.[keyStat] || {}
    if (!url && !dataRaw) {
      throw new Error('API not found', {status: 404, cause: {details: 'API not found', status: 404}})
    }

    if (dataRaw) {
      const data = converter(dataRaw)
      return res.status(200).json(data)
    }

    const response = await fetch(url)
    const {status} = response
    if (status !== 200) {
      throw new Error('API not found', {cause: {details: 'Error while fetching API', status}})
    }

    const data = converter(await response.json())
    res.status(status).json(data)
  } catch (error) {
    const {message, cause} = error
    console.error('Error on Front-end Stat API :', message, cause, error)
    res.status(cause?.status || 500).send(message || 'Internal server error')
  }
}
