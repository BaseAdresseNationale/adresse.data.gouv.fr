import React, {useState, useCallback, useEffect} from 'react'
import Router from 'next/router'
import {debounce} from 'lodash'

import {search} from '../../lib/explore/api'
import {useInput} from '../../hooks/input'

import SearchInput from '../search-input'
import Notification from '../notification'
import renderAddok from '../search-input/render-addok'

const ExploreSearch = () => {
  const [input, setInput] = useInput('')
  const [results, setResults] = useState([])
  const [orderResults, setOrderResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSelect = feature => {
    const {id, type, citycode, numero} = feature.properties
    const codeCommune = citycode
    const idVoie = id.split('_').slice(0, 2).join('_')
    let href = ''
    let as = ''

    if (type === 'municipality') {
      href = `/explore/commune?codeCommune=${codeCommune}`
      as = `/explore/commune/${codeCommune}`
    } else if (type === 'street') {
      href = `/commune/voie?idVoie=${idVoie}`
      as = `/explore/commune/${codeCommune}/voie/${idVoie}`
    } else if (type === 'housenumber') {
      href = `/explore/commune/voie?codeCommune=${codeCommune}&idVoie=${idVoie}&numero=${numero}`
      as = `/explore/commune/${codeCommune}/voie/${idVoie}/numero/${numero}`
    }

    Router.push(href, as)
  }

  const handleSearch = useCallback(debounce(async input => {
    try {
      const results = await search(input)
      setResults(
        results.features.filter(f => f.properties.type !== 'locality').splice(0, 5) || []
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
      <SearchInput
        value={input}
        results={orderResults}
        loading={loading}
        placeholder='20 avenue de Ségur, Paris'
        onSelect={handleSelect}
        onSearch={setInput}
        renderItem={renderAddok}
        getItemValue={getFeatureValue} />

      {error &&
        <div className='error'>
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

export default ExploreSearch
