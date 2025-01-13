import PropTypes from 'prop-types'
import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { groupBy } from 'lodash'

import { search, isFirstCharValid } from '@/lib/api-adresse'
import { getCommune as getCommuneByINSEE } from '@/lib/api-ban'
import { removeAccent } from '@/utils/string'

import SearchInput from './search-input'
import { env } from 'next-runtime-env'

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
}

// TODO : Extract from BDD
// List of district with shortName
const normalizeName = (name: string) => removeAccent(name.toLowerCase())
const shortDistrictName = [
  'Bû', 'Ry', 'Eu', 'Sy', 'Oz',
  'Us', 'Ri', 'Uz', 'Oô', 'Py',
  'Ur', 'Gy', 'Y', 'By',
].map(normalizeName)

const searchDataInBan = ({
  type,
  postcode,
  citycode,
  debug,
}: TypeSearchDataInBan = {}) =>
  async (_strSearch: string, signal: AbortSignal) => {
    const strSearch = (shortDistrictName.includes(normalizeName(_strSearch)))
      ? _strSearch.padEnd(3, '.')
      : _strSearch

    if (typeof strSearch === 'string' && isFirstCharValid(strSearch) && strSearch.length >= minChars) {
      try {
        const communePromise = strSearch.length === codeInseeSize
          ? (getCommuneByINSEE(strSearch, signal)
              .then(result => ({ properties: formatBanToProperties(result) }))
              .catch((err) => {
                if (debug) console.error('err getCommuneByINSEE >', err)
                return null
              }))
          : null
        const searchApiPromise = search({ q: strSearch, limit: 7, type, postcode, citycode, autocomplete: true }, signal)
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

const itemMenuFormater = (item:
{ properties: { id: string, name: string, context: string, city: string, citycode: string, type: string }, header: string }
) => {
  const { properties: { id, name, context, city, citycode, type }, header } = item
  const [codeDepartement, departement, region] = context.split(', ')

  const label = name
  const details = `${type === 'municipality'
    ? `Code Insee - COG ${citycode} `
    : `${city} `
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
  hasPreferedPageResult?: boolean
}

function BanSearch({ children, filter = {}, placeholder, hasPreferedPageResult }: BanSearchProps) {
  const [error, setError] = useState<Error | null>(null)

  const router = useRouter()
  const onSearch = useMemo(() => searchDataInBan({ ...filter }), [filter])

  interface FeatureProperties {
    id: string
    citycode: string
    type: string
  }

  interface Feature {
    properties: FeatureProperties
  }

  const handleSelect = useCallback((feature: Feature) => {
    const { id, citycode: codeCommune, type } = feature?.properties || {}
    if (hasPreferedPageResult && type === 'municipality') {
      router.push(`/commune/${codeCommune}`)
    }
    else if (id) {
      router.push(`${URL_CARTOGRAPHY_BAN}?id=${id}`)
    }
  }, [hasPreferedPageResult, router])
  const handleError = useCallback((err: Error) => setError(err), [])

  return (
    <SearchInput
      placeholder={placeholder}
      itemMenuFormater={itemMenuFormater}
      onSearch={onSearch}
      onSelect={handleSelect}
      onError={handleError}
      hasLoader
    >
      {children}
    </SearchInput>
  )
}

BanSearch.propTypes = {
  filter: PropTypes.shape({
    type: PropTypes.string,
    postcode: PropTypes.string,
    citycode: PropTypes.string,
  }),
  placeholder: PropTypes.string,
  hasPreferedPageResult: PropTypes.bool,
}

export default BanSearch
