/* eslint operator-linebreak: ["error", "before"] */
import PropTypes from 'prop-types'
import {useState, useCallback, useMemo} from 'react'
import {useRouter} from 'next/router'
import {groupBy} from 'lodash'

import {search, isFirstCharValid} from '@/lib/api-adresse'
import {getCommune as getCommuneByINSEE} from '@/lib/api-ban'

import SearchInput from '@/components/search-input'
import Notification from '@/components/notification'

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

const formatBanToProperties = ({
  id,
  nomCommune,
  departement,
  region,
  codesPostaux,
  codeCommune,
}) => ({
  id,
  type: 'municipality',
  name: nomCommune,
  postcode: codesPostaux?.[0],
  citycode: codeCommune,
  city: nomCommune,
  context: `${departement?.code}, ${departement?.nom}, ${region?.nom}`,
})

const searchDataInBan = ({type, postcode, citycode, debug} = {}) => async (strSearch, signal) => {
  // Note: Item should be like : {properties: {id, name, context, city, citycode, type, postcode}, header}
  if (typeof strSearch === 'string' && isFirstCharValid(strSearch) && strSearch.length >= minChars) {
    try {
      const communePromise = strSearch.length === codeInseeSize
        ? (getCommuneByINSEE(strSearch, signal)
          .then(result => ({properties: formatBanToProperties(result)})) // eslint-disable-line promise/prefer-await-to-then
          .catch(err => debug && console.error('err getCommuneByINSEE >', err) && null)) // eslint-disable-line promise/prefer-await-to-then
        : null
      const searchApiPromise = search({q: strSearch, limit: 7, type, postcode, citycode, autocomplete: true}, signal)
      const [communeResult, searchApiResults] = await Promise.all([communePromise, searchApiPromise])
      const results = [
        ...(communeResult ? [communeResult] : []),
        ...(searchApiResults?.features) || []
      ].filter(
        // TODO : Make special pages for Paris, Marseille and Lyon and remove this filter
        ({properties}) => (!['75056', '13055', '69123'].includes(properties.id)) // Filter Paris, Marseille and Lyon
      )
      const groupByType = groupBy(results, 'properties.type')
      const {housenumber, ...restOfFeaturesTypes} = featuresTypes
      const computedFeaturesTypes = Number.isNaN(strSearch[0])
        ? {...restOfFeaturesTypes, housenumber}
        : {housenumber, ...restOfFeaturesTypes}
      const orderResults = Object.entries(
        Object.keys(computedFeaturesTypes)
          .reduce((acc, key) => ({ // eslint-disable-line unicorn/no-array-reduce
            ...acc,
            ...(groupByType[key] ? {[key]: groupByType[key]} : {})
          }), {})
      ).flatMap(([category, [firstValue, ...otherValues]]) => {
        return [
          ...(firstValue
            ? (type
              ? [firstValue]
              : [{...firstValue, header: featuresTypes?.[category] || `${category}`}])
            : []),
          ...(otherValues || [])
        ]
      })

      return orderResults
    } catch (err) {
      if (debug) {
        console.error(err)
      }
    }
  }

  return []
}

const itemMenuFormater = item => {
  const {properties: {id, name, context, city, citycode, type}, header} = item
  const [codeDepartement, departement, region] = context.split(', ')

  const label = name
  const details = `${type === 'municipality'
    ? `Code Insee ${citycode} `
    : `${city} `
  }(${codeDepartement}, ${departement}, ${region})`

  return {id, header, label, details}
}

function BanSearch({filter = {}, placeholder, hasPreferedPageResult}) {
  const [error, setError] = useState(null)

  const router = useRouter()
  const onSearch = useMemo(() => searchDataInBan({...filter}), [filter])

  const handleSelect = useCallback(feature => {
    const {id, citycode: codeCommune, type} = feature?.properties || {}
    if (hasPreferedPageResult && type === 'municipality') {
      router.push(`/commune/${codeCommune}`)
    } else if (id) {
      router.push(`/base-adresse-nationale?id=${id}`, `/base-adresse-nationale/${id}`)
    }
  }, [hasPreferedPageResult, router])
  const handleError = useCallback(err => setError(err), [])

  return (
    <>
      <SearchInput
        placeholder={placeholder}
        itemMenuFormater={itemMenuFormater}
        onSearch={onSearch}
        onSelect={handleSelect}
        onError={handleError}
        wrapperStyle={{position: 'relative'}}
        hasLoader
      />

      {error
        && <div className='error'>
          <Notification message={error.message} type='error' />
        </div>}

      <style jsx>{`
          .error {
            margin: 1em 0;
          }
        `}</style>
    </>
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
