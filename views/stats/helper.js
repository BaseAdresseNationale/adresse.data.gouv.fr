import {
  colorthemes as customColor,
  defaultTheme,
} from '@/components/charts'
import {getStats} from '@/lib/api-ban'

const colorName = 'glicyne'

const legendTranslate = {
  interopKeyTotal: 'Clé d\'interoperabilité conservée',
  interopKeyRemove: 'Clé d\'interoperabilité supprimmé',
  interopKeyNew: 'Nouvelle clé d\'interoperabilité',
  addrTotal: 'Total des adresses',

  'download BAL': 'Fichiers BAL',
  'Download BAL': 'Fichiers BAL',
  'download CSV historique adresses': 'CSV historique adresses',
  'Download CSV historique adresses': 'CSV historique adresses',
  'download CSV historique lieux-dits': 'CSV historique lieux-dits',
  'Download CSV historique lieux-dits': 'CSV historique lieux-dits',

  nbSearch: 'Recherche',
  nbSearchResult: 'Résultats de recherche',
  nbSearchEmptyResult: 'Recherche sans résultat',
  nbReverseSearch: 'Recherche inversée',
  nbReverseSearchEmptyResult: 'Recherche inversée sans résultat',
  nbReverseSearchResult: 'Résultats de recherche inversée',

  nbVisits: 'Visites',
  nbUniqVisitors: 'Visiteurs uniques',
}

export const matomoToVisitData = (matomoData = {}) => Object.entries(matomoData)
  .map(([dataDate, {nb_visits: nbVisits, nb_uniq_visitors: nbUniqVisitors}]) => {
    return [dataDate, {nbVisits, nbUniqVisitors}]
  })
  .map(([dataDate, dataStat]) => {
    return {
      period: dataDate,
      label: 'visit',
      ...Object
        .fromEntries(
          Object
            .entries(dataStat)
            .map(([key, value]) => [legendTranslate[key] || key, value])
        )
    }
  })

export const matomoDailyToData = (matomoData = {}) => Object.entries(matomoData)
  .map(([dataDate, dataStat]) => {
    const filtredDataStat = dataStat.filter((dataStatItem = {}) => /^download/i.test(dataStatItem.label))
    return [dataDate, filtredDataStat]
  })
  .map(([dataDate, dataStat]) => {
    const finalDataStat = dataStat
      .map((dataStatItem = {}) => {
        const {label, nb_events: nbEvents, subtable} = dataStatItem
        const otherFields = Object.fromEntries(
          subtable.map((subtableItem = {}) => {
            const {label: subtableLabel, nb_events: subtableNbEvents} = subtableItem
            return [legendTranslate[subtableLabel] || subtableLabel, subtableNbEvents]
          })
        )

        return {
          label,
          period: dataDate,
          total: nbEvents,
          ...otherFields,
        }
      })
    return finalDataStat[0]
  })

export const matomoMonthlyToData = (matomoMonthlyData = {}) => {
  const [date = '', value = []] = Object
    .entries(matomoMonthlyData)
    .reverse()?.[0] || []
  const [year, month] = date.split('-')
  const period = (new Date(year, month - 1, 1)).toLocaleDateString('fr-FR', {year: 'numeric', month: 'long'})
  return {
    period,
    value: value?.[0] || {},
  }
}

export const geocoderSearchToData = (geocoderData = []) => {
  const data = geocoderData
    .map(({period, ...value}) => {
      const translatedValues = Object.fromEntries(
        Object.entries(value)
          .map(([key, value]) => {
            return [legendTranslate[key] || key, value]
          })
      )
      return {
        period,
        ...translatedValues,
      }
    }
    )
  return data
}

export const getDataDef = (dataDef = [], themeColor = null) => dataDef
  .reduce((acc, {dataKey, colors, ...dataItem}, index) => { // eslint-disable-line unicorn/no-array-reduce
    const theme = (themeColor ? customColor[colorName]?.[index] : defaultTheme?.[index]) || defaultTheme[0]
    return {
      ...acc,
      [legendTranslate[dataKey] || dataKey]: {
        stroke: colors?.[0] || theme?.[0],
        fill: colors?.[1] || theme?.[1],
        ...dataItem
      },
    }
  }, {})

export const getBanStatsData = async () => {
  const {ban: dataBanStats, bal: dataBalStats} = await getStats() || {}
  return dataBanStats && dataBalStats ? [
    {value: `${(Number(((dataBanStats.nbAdresses) * 0.000001).toFixed(2)))}`, unit: 'M', label: 'Total des adresses au sein de la Base Adresse National'},
    {value: `${(Number(((dataBalStats.nbAdresses) * 0.000001).toFixed(2)))}`, unit: 'M', label: 'Adresses issues des Bases Adresses Locales', hasSeparator: true},
    {value: `${(Number(((dataBanStats.nbAdresses - dataBalStats.nbAdresses) * 0.000001).toFixed(2)))}`, unit: 'M', label: 'Adresses issues des autres sources'},
    {value: `${(Number(((dataBalStats.nbAdressesCertifiees) * 0.000001).toFixed(2)))}`, unit: 'M', label: 'Adresses certifiées', hasSeparator: true},
  ] : []
}

export const fetcher = async (...args) => (await fetch(...args))?.json()
