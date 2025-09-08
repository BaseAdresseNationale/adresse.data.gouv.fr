import { useState, useCallback, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { env } from 'next-runtime-env'
import { groupBy } from 'lodash'

import { search, isFirstCharValid } from '@/lib/api-adresse'
import { getCommune as getCommuneByINSEE } from '@/lib/api-ban'
import { removeAccent } from '@/utils/string'

import SearchInput from './search-input'
import shortDistrictNameRaw from './district-short-name.json'

const URL_CARTOGRAPHY_BAN = env('NEXT_PUBLIC_URL_CARTOGRAPHY_BAN')

const featuresTypes = {
  municipality: 'Communes ou Arrondissements',
  city: 'Villes',
  village: 'Villages',
  hamlet: 'Hameaux',
  street: 'Voies',
  locality: 'Lieux-dits',
  housenumber: 'Adresse',
}

const minChars = 3
const codeInseeSize = 5

interface TypeFormatBanToProperties {
  id: string
  nomCommune: string
  departement: { code: string, nom: string }
  region: { nom: string }
  codesPostaux: string[]
  codeCommune: string
}

const formatBanToProperties = ({
  id,
  nomCommune,
  departement,
  region,
  codesPostaux,
  codeCommune,
}: TypeFormatBanToProperties) => ({
  id,
  type: 'municipality',
  name: nomCommune,
  postcode: codesPostaux?.[0],
  citycode: codeCommune,
  city: nomCommune,
  context: [departement?.code, departement?.nom, region?.nom].filter(entry => Boolean(entry)).join(', '),
})

interface TypeSearchDataInBan {
  type?: string
  postcode?: string
  citycode?: string
  debug?: boolean
  hasBanData?: boolean
  hasGeocoderData?: boolean
}

const normalizeName = (name: string) => removeAccent(name.toLowerCase())
const shortDistrictName = shortDistrictNameRaw.map(normalizeName)

const searchDataInBan = ({
  type,
  postcode,
  citycode,
  debug,
  hasBanData = true,
  hasGeocoderData = true,
}: TypeSearchDataInBan = {}) =>
  async (_strSearch: string, signal: AbortSignal) => {
    const strSearch = (shortDistrictName.includes(normalizeName(_strSearch)))
      ? _strSearch.padEnd(3, '.')
      : _strSearch

    if (typeof strSearch === 'string' && isFirstCharValid(strSearch) && strSearch.length >= minChars) {
      try {
        const communePromise = hasBanData
          ? (
              strSearch.length === codeInseeSize
                ? (getCommuneByINSEE(strSearch, signal)
                    .then(result => ({ properties: formatBanToProperties(result) }))
                    .catch((err) => {
                      if (debug) console.error('err getCommuneByINSEE >', err)
                      return null
                    }))
                : null)
          : null
        const searchApiPromise = hasGeocoderData ? search({ q: strSearch, limit: 7, type, postcode, citycode, autocomplete: true }, signal) : null
        const [communeResult, searchApiResults] = await Promise.all([communePromise, searchApiPromise])
        const results = [
          ...(communeResult ? [communeResult] : []),
          ...(searchApiResults?.features) || [],
        ].filter(
          // TODO : Next is filter for Paris, Marseille and Lyon SO Make special pages for Paris, Marseille and Lyon and remove this filter
          ({ properties }) => (!['75056', '13055', '69123'].includes(properties.id))
        )
        const groupByType = groupBy(results, 'properties.type')
        const { housenumber, ...restOfFeaturesTypes } = featuresTypes
        const computedFeaturesTypes = Number.isNaN(strSearch[0])
          ? { ...restOfFeaturesTypes, housenumber }
          : { housenumber, ...restOfFeaturesTypes }
        const orderResults = (Object.entries(
          Object.keys(computedFeaturesTypes)
            .reduce((acc, key) => ({
              ...acc,
              ...(groupByType[key] ? { [key]: groupByType[key] } : {}),
            }), {})
        )).flatMap(([category, value]) => {
          const [firstValue, ...otherValues] = value as Record<string, unknown>[]
          return [
            ...(firstValue
              ? (type
                  ? [firstValue]
                  : [{
                      ...firstValue,
                      header: featuresTypes?.[category as keyof typeof featuresTypes] || `${category}`,
                    }])
              : []),
            ...(otherValues || []),
          ]
        })

        return orderResults
      }
      catch (err) {
        if (debug) {
          console.error(err)
        }
      }
    }

    return []
  }

const PML = [
  {
    city: 'Paris',
    codes: [
      '75101', '75102', '75103', '75104', '75105', '75106',
      '75107', '75108', '75109', '75110', '75111', '75112',
      '75113', '75114', '75115', '75116', '75117', '75118',
      '75119', '75120',
    ],
  },
  {
    city: 'Marseille',
    codes: [
      '13201', '13202', '13203', '13204', '13205', '13206',
      '13207', '13208', '13209', '13210', '13211', '13212',
      '13213', '13214', '13215', '13216',
    ],
  },
  {
    city: 'Lyon',
    codes: [
      '69381', '69382', '69383', '69384', '69385',
      '69386', '69387', '69388', '69389',
    ],
  },
]
const PMLCodes = new Set(PML.flatMap(entry => entry.codes))

const itemMenuFormater = (item:
{ properties: { id: string, name: string, context: string, city: string, citycode: string, type: string, district: string }, header: string }
) => {
  const { properties: { id, name, context, city, citycode, type, district }, header } = item
  const [codeDepartement, departement, region] = context.split(', ')
  const label = name
  const isInPML = PMLCodes.has(citycode)
  const details = `${type === 'municipality'
    ? `Code Insee - COG ${citycode} `
    : `${isInPML ? district : city} `
  }(${codeDepartement}, ${departement}${region ? `, ${region}` : ''})`

  return { id, header, label, details }
}

interface BanSearchProps {
  children?: React.ReactNode
  filter?: {
    type?: string
    postcode?: string
    citycode?: string
  }
  placeholder?: string
  onSelect?: (feature: GeoJSON.Feature) => void
  isDebugMode?: boolean
}

function BanSearch({
  children,
  filter = {},
  placeholder,
  onSelect,
  isDebugMode,
}: BanSearchProps) {
  const [error, setError] = useState<Error | null>(null)

  const router = useRouter()
  const onSearch = useMemo(() => searchDataInBan({ ...filter }), [filter])

  const defaultHandleSelect = useCallback((feature: GeoJSON.Feature) => {
    const { id } = feature?.properties || {}
    router.push(`${URL_CARTOGRAPHY_BAN}?id=${id}`)
  }, [router])

  const handleError = useCallback((err: Error) => setError(err), [])

  useEffect(() => {
    if (isDebugMode) console.error('error >', error)
  }, [error, isDebugMode])

  return (
    <SearchInput
      placeholder={placeholder}
      itemMenuFormater={itemMenuFormater}
      onSearch={onSearch}
      onSelect={onSelect || defaultHandleSelect}
      onError={handleError}
      hasLoader
    >
      {children}
    </SearchInput>
  )
}

export default BanSearch
