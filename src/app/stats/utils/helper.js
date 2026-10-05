import {
  colorthemes as customColor,
  defaultTheme,
} from '@/components/Charts/ColorTheme'
import { getStats } from '@/lib/api-ban'
import { getStats as getBalAdminStats } from '@/lib/api-bal-admin'
import { defDataFirstsPublications, firstsPublicationsObjectives } from './stats-config-data'

const defaultColorName = 'glicyne'

const extractFromConfig = (dataDef) => {
  const translateDataName = Object.fromEntries(dataDef.config.map(({ dataKeyRaw: key, dataKeyLabel: value }) => [key, value]))
  const defaultSubTable = Object.fromEntries(Object.values(translateDataName).map(label => [label, 0]))

  const defaultEntry = {
    ...(dataDef?.default || {}),
    ...defaultSubTable,
  }

  return {
    translateDataName,
    defaultSubTable,
    defaultEntry,
  }
}

export const matomoToLookupMonthlyUsage = dataDef => (matomoData) => {
  const { translateDataName, defaultSubTable, defaultEntry } = extractFromConfig(dataDef)

  return Object
    .entries(matomoData)
    .map(([dataDate, data]) => {
      const currentEntry = { ...defaultEntry, period: dataDate }
      const finalDataStat = data.reduce((dataAcc, { label, nb_events: nbEvents, subtable = [] }) => {
        return label === defaultEntry.label
          ? {
              ...currentEntry,
              ...(subtable.reduce((subtableAcc, { label: subtableItemLabel, nb_events: subtableNbEvents }) => {
                const decodedSubtableItemLabel = `${decodeURIComponent(subtableItemLabel)}`
                const key = translateDataName[decodedSubtableItemLabel] || decodedSubtableItemLabel
                return {
                  ...subtableAcc,
                  [key]: (dataAcc?.[key] || 0) + (subtableAcc[key] || 0) + Number(subtableNbEvents),
                }
              }, defaultSubTable)),
              [translateDataName.Total]: (dataAcc?.[translateDataName.Total] || 0) + nbEvents,
            }
          : {}
      }, currentEntry)

      return finalDataStat
    })
}

export const matomoToVisitData = dataDef => (matomoData = {}) => {
  const { translateDataName, defaultEntry } = extractFromConfig(dataDef)

  return Object
    .entries(matomoData)
    .map(([dataDate, { nb_visits: nbVisits, nb_uniq_visitors: nbUniqVisitors }]) => {
      return [dataDate, { nbVisits, nbUniqVisitors }]
    })
    .map(([dataDate, dataStat]) => {
      const currentEntry = { ...defaultEntry, period: dataDate }
      return {
        ...currentEntry,
        ...Object
          .fromEntries(
            Object
              .entries(dataStat)
              .map(([key, value]) => [translateDataName[key] || key, value])
          ),
      }
    })
}

export const matomoDailyDownloadToData = dataDef => (matomoData = {}) => {
  const { translateDataName, defaultEntry } = extractFromConfig(dataDef)

  return Object.entries(matomoData)
    .map(([dataDate, dataStat]) => {
      const statHeader = {
        ...defaultEntry,
        period: dataDate,
      }

      const filtredDataStat
        = dataStat
          .filter((dataStatItem = {}) => /^download/i.test(dataStatItem.label))
          .map((dataStatItem = {}) => {
            const { nb_events: nbEvents, subtable } = dataStatItem
            const fields = subtable.map((subtableItem = {}) => {
              const { label: labelRaw, nb_events: subtableNbEvents } = subtableItem
              const subtableLabel = decodeURIComponent(labelRaw)
              return [subtableLabel, Number(subtableNbEvents) || 0]
            })
            statHeader.total += nbEvents
            return fields
          })
          .flat()
          .reduce((acc, [keyRaw, value]) => {
            const key = translateDataName[keyRaw] || translateDataName['Other Download']
            acc[key] = (acc[key] || 0) + value
            return acc
          }, {})

      return {
        ...statHeader,
        ...filtredDataStat,
      }
    })
}
/*
  @param
  */
export const getDataDef = (dataDef, themeColor) => dataDef.config
  .reduce((acc, { dataKeyLabel, colors, ...dataItem }, index) => {
    const theme = (themeColor ? customColor[defaultColorName]?.[index] : defaultTheme?.[index]) || defaultTheme[0]
    return {
      ...acc,
      [dataKeyLabel]: {
        stroke: colors?.[0] || theme?.[0],
        fill: colors?.[1] || theme?.[1],
        ...dataItem,
      },
    }
  }, {})

const matomoMonthlyDownloadToData = (matomoMonthlyDownloadData = {}) => {
  const [date = '', value = []] = Object
    .entries(matomoMonthlyDownloadData)
    .reverse()?.[0] || []
  const [year, month] = date.split('-')
  const period = (new Date(year, month - 1, 1)).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })
  return {
    period,
    value: value?.[0] || {},
  }
}

const matomoMonthlyLookupToData = (matomoMonthlyLookupData = {}) => {
  const [date = '', value = []] = Object
    .entries(matomoMonthlyLookupData)
    .reverse()?.[0] || []
  const [year, month] = date.split('-')
  const period = (new Date(year, month - 1, 1)).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })

  return {
    period,
    value: value?.[0] || {},
  }
}

export const fetchMatomo = url => {
  const endpoint = new URL(url)
  const body = new URLSearchParams(endpoint.searchParams)
  endpoint.search = ''

  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body,
    cache: 'no-store',
  })
}

export const getMonthlyUsageData = ([monthlyDownloadUrl, monthlyLookupUrl]) => async () => {
  const validStatus = new Set([200, 304])

  const getValue = (valueRaw) => {
    if (Number.isNaN(valueRaw)) {
      return {
        value: valueRaw,
      }
    }

    if (valueRaw >= 10_000_000) {
      return {
        value: (valueRaw / 1_000_000).toPrecision(4),
        unit: 'M',
      }
    }

    if (valueRaw >= 1_000_000) {
      return {
        value: (valueRaw / 1_000_000).toPrecision(2),
        unit: 'M',
      }
    }

    if (valueRaw >= 100_000) {
      return {
        value: (valueRaw / 1_000).toPrecision(5),
        unit: 'K',
      }
    }

    if (valueRaw >= 10_000) {
      return {
        value: (valueRaw / 1_000).toPrecision(4),
        unit: 'K',
      }
    }

    if (valueRaw >= 1_000) {
      return {
        value: (valueRaw / 1_000).toPrecision(3),
        unit: 'K',
      }
    }

    return {
      value: valueRaw,
    }
  }

  const [responseMonthlyDownload, responseMonthlyLookup] = await Promise.all(
    [
      monthlyDownloadUrl,
      monthlyLookupUrl,
    ].map(fetchMatomo)
  )

  const { status: statusMonthlyDownload } = responseMonthlyDownload
  if (!validStatus.has(statusMonthlyDownload)) {
    throw new Error('API not found', { cause: { details: 'Error while fetching API', status: statusMonthlyDownload } })
  }

  const { status: statusMonthlyLookup } = responseMonthlyLookup
  if (!validStatus.has(statusMonthlyLookup)) {
    throw new Error('API not found', { cause: { details: 'Error while fetching API', status: statusMonthlyLookup } })
  }

  const dataMonthlyUsage = matomoMonthlyDownloadToData(await responseMonthlyDownload.json())
  const dataMonthlyLookup = matomoMonthlyLookupToData(await responseMonthlyLookup.json())

  return {
    period: dataMonthlyUsage.period,
    value: dataMonthlyUsage
      ? [
          { ...getValue(`${dataMonthlyLookup?.value?.nb_events || ''}`),
            label: 'Recherches',
            description: 'effectuées sur notre API d’exploration de la BAN.*',
            note: '* Consommation de l’“API Lookup”. Total mensuel sur la periode.',
          },
          { ...getValue(`${dataMonthlyUsage?.value?.nb_events || ''}`),
            label: 'Téléchargements',
            description: 'des données BAN sur nos serveurs.**',
            note: '** Total mensuel des téléchargements sur la periode.',
            hasSeparator: true,
          },
        ]
      : [],
  }
}

export const getQualityData = () => {
  // TODO: Replace with real data
  const fakeDataQualityScore = {
    0: 39,
    1: 9,
    2: 22,
    3: 19,
    4: 2,
    5: 9,
  }

  const StateBanDefs = [
    { color: '#e2d8f5', description: 'Adresses composés à partir de sources multiples (autre que BAL)' },
    { color: '#f9e7c7', description: 'Adresses issues des Bases Adresses Locales' },
    { color: '#f7c6c6', description: 'Adresses certifiées' },
    { color: '#cccccc', description: 'Total des adresses au sein de la Base Adresse National' },
  ]

  const QualityDefs = [
    { color: '#869ECE', description: 'Adresses issues de l\'assemblage de sources non certifiable' },
    { color: '#A695E7', description: 'Adresses issues de l\'assemblage de sources certifiées' },
    { color: '#3C91E6', description: 'Adresses issues d\'une Base Adresse Locale' },
    { color: '#0E6AA2', description: 'Adresses certifiées ou referençants une parcelle cadastrale' },
    { color: '#F5C242', description: 'Adresses identifiables et suivies au sein d\'une Base Adresse Locale' },
    { color: '#E65A5A', description: 'Adresses certifiées et referençants une parcelle cadastrale' },
  ]

  const DataQuality = [
    Object
      .entries(fakeDataQualityScore)
      .reduce((acc, [key, value]) => {
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
        return acc
      }, [])
      .map((value, index) => [`${index}`, value])
      .map(
        ([name, value]) => ({
          name, value,
          color: StateBanDefs[Number(name)].color,
          description: StateBanDefs[Number(name)].description,
        })
      ),
    Object
      .entries(fakeDataQualityScore)
      .map(
        ([name, value]) => ({
          name, value,
          color: QualityDefs[Number(name)].color,
          description: QualityDefs[Number(name)].description,
        })
      ),
  ]
  return DataQuality
}

export const getBanStatsData = async () => {
  const { ban: dataBanStats, bal: dataBalStats } = await getStats() || {}
  return dataBanStats && dataBalStats
    ? [
        { value: `${(Number(((dataBanStats.nbAdresses) * 0.000001).toFixed(2)))}`, unit: 'M', label: 'Total des adresses au sein de la Base Adresse Nationale' },
        { value: `${(Number(((dataBalStats.nbAdresses) * 0.000001).toFixed(2)))}`, unit: 'M', label: 'Adresses issues des Bases Adresses Locales', hasSeparator: true },
        { value: `${(Number(((dataBanStats.nbAdresses - dataBalStats.nbAdresses) * 0.000001).toFixed(2)))}`, unit: 'M', label: 'Adresses issues des autres sources' },
        { value: `${(Number(((dataBalStats.nbAdressesCertifiees) * 0.000001).toFixed(2)))}`, unit: 'M', label: 'Adresses certifiées', hasSeparator: true },
      ]
    : []
}

const FIRSTS_PUBLICATIONS_START_PERIOD = '2019-01'

// Liste des mois 'yyyy-MM' entre from et to inclus
const getMonthlyPeriods = (from, to) => {
  const periods = []
  let [year, month] = from.split('-').map(Number)
  const [toYear, toMonth] = to.split('-').map(Number)
  while (year < toYear || (year === toYear && month <= toMonth)) {
    periods.push(`${year}-${String(month).padStart(2, '0')}`)
    month = month === 12 ? 1 : month + 1
    year = month === 1 ? year + 1 : year
  }

  return periods
}

// Convertit { 'MM-yyyy': nombre } en [{ period: 'yyyy-MM', [label]: cumul, [objectif]: valeur }] mois par mois
const firstsPublicationsToData = dataDef => (record = {}) => {
  const [{ dataKeyLabel }, { dataKeyLabel: objectiveKeyLabel }] = dataDef.config
  const monthlyValues = new Map(
    Object.entries(record).map(([monthKey, value]) => {
      const [month, year] = monthKey.split('-')
      return [`${year}-${month}`, Number(value) || 0]
    })
  )
  const dataPeriods = [...monthlyValues.keys()].sort()
  if (dataPeriods.length === 0) {
    return []
  }

  const lastDataPeriod = dataPeriods.at(-1)
  const lastPeriod = [lastDataPeriod, ...Object.keys(firstsPublicationsObjectives)].sort().at(-1)
  let cumulative = 0

  return getMonthlyPeriods(dataPeriods[0], lastPeriod)
    .map((period) => {
      cumulative += monthlyValues.get(period) || 0
      return {
        ...dataDef.default,
        period,
        // Pas de cumul après le dernier mois de données : la courbe s'arrête
        ...(period <= lastDataPeriod && { [dataKeyLabel]: cumulative }),
        ...(firstsPublicationsObjectives[period] && { [objectiveKeyLabel]: firstsPublicationsObjectives[period] }),
      }
    })
    // Le cumul inclut les mois antérieurs, mais l'affichage commence en janvier 2019
    .filter(({ period }) => period >= FIRSTS_PUBLICATIONS_START_PERIOD)
}

export const getBalStatsData = async () => {
  const {
    firsts_publications: firstsPublications,
    sources_publication_ban: sourcesPublicationBan,
  } = await getBalAdminStats(['sources_publication_ban', 'firsts_publications']) || {}

  return {
    firsts_publications: firstsPublicationsToData(defDataFirstsPublications)(firstsPublications?.value),
    sources_publication_ban: sourcesPublicationBan?.value,
  }
}


export const fetcher = async (...args) => (await fetch(...args))?.json()
