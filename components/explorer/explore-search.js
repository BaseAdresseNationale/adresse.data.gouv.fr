import React, {useState, useCallback, useEffect} from 'react'
import {useRouter} from 'next/router'
import {debounce} from 'lodash'

import theme from '@/styles/theme'

import {search} from '@/lib/explore/api'
import {useInput} from '../../hooks/input'

import SearchInput from '@/components/search-input'
import Notification from '@/components/notification'
import renderAddok from '@/components/search-input/render-addok'

function ExploreSearch() {
  const [input, setInput] = useInput('')
  const [results, setResults] = useState([])
  const [orderResults, setOrderResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const router = useRouter()

  const handleSelect = feature => {
    const {id, type, citycode, housenumber} = feature.properties
    const codeCommune = citycode
    const idVoie = id.split('_').slice(0, 2).join('_')
    let href = ''
    let as = ''

    if (type === 'municipality') {
      href = `/base-adresse-nationale?codeCommune=${codeCommune}`
      as = `/base-adresse-nationale/commune/${codeCommune}`
    } else if (type === 'street') {
      href = `/base-adresse-nationale?codeCommune=${codeCommune}&idVoie=${idVoie}`
      as = `/base-adresse-nationale/commune/${codeCommune}/voie/${idVoie}`
    } else if (type === 'housenumber') {
      const [numero, suffixe] = housenumber.split(' ')
      const numeroComplet = `${numero}${suffixe || ''}`
      href = `/base-adresse-nationale?codeCommune=${codeCommune}&idVoie=${idVoie}&numero=${numeroComplet}`
      as = `/base-adresse-nationale/commune/${codeCommune}/voie/${idVoie}/numero/${numeroComplet}`
    }

    router.push(href, as)
  }

  const handleSearch = useCallback(debounce(async input => {
    try {
      const results = await search(input)
      setResults(
        results.features
          .filter(({properties}) => !['75056', '13055', '69123'].includes(properties.id)) // Filter Paris, Marseille and Lyon
          .filter(f => f.properties.type !== 'locality').splice(0, 5) || []
      )
    } catch (err) {
      setError(err)
    }

    setLoading(false)
  }, 300), [])

  const getFeatureValue = feature => {
    return feature.header ? feature.header : feature.properties.name
  }

  useEffect(() => {
    if (results && results.length > 0) {
      const orderResults = []
      results.map(feature => {
        if (!orderResults.find(item => item.header === feature.properties.type)) {
          orderResults.push({
            header: feature.properties.type
          })
        }

        return orderResults.push(feature)
      })

      setOrderResults(orderResults)
    }
  }, [results])

  useEffect(() => {
    if (input) {
      setResults([])
      setLoading(true)
      setError(null)
      handleSearch(input)
    }
  }, [handleSearch, input])

  return (
    <>
      <p className='example'>Rechercher une adresse, une voie, un lieu-dit ou une commune dans la Base Adresse Nationale</p>

      <SearchInput
        value={input}
        results={orderResults}
        isLoading={loading}
        placeholder='20 avenue de Ségur, Paris'
        onSelect={handleSelect}
        onSearch={setInput}
        renderItem={renderAddok}
        wrapperStyle={{position: 'relative'}}
        getItemValue={getFeatureValue} />

      {error &&
        <div className='error'>
          <Notification message={error.message} type='error' />
        </div>}

      <style jsx>{`
          .example {
            font-size: 1.5em;
            text-align: center;
            background-color: ${theme.colors.white};
          }

          .error {
            margin: 1em 0;
          }
        `}</style>
    </>
  )
}

export default ExploreSearch
