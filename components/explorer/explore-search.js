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
    const {id, type} = feature.properties
    const [rawCodeCommune, rawCodeVoie, rawNumero, rawSuffixe] = id.split('_')
    const codeCommune = rawCodeCommune.toUpperCase()
    const codeVoie = rawCodeVoie ? rawCodeVoie.toUpperCase() : null
    const numero = rawNumero ? Number.parseInt(rawNumero, 10).toString() : null
    const suffixe = rawSuffixe ? rawSuffixe.toUpperCase() : null
    const numeroComplet = numero ? numero + (suffixe || '') : null

    let href = ''
    let as = ''

    if (type === 'municipality') {
      href = `/explore/commune?codeCommune=${codeCommune}`
      as = `/explore/commune/${codeCommune}`
    } else if (type === 'street') {
      href = `/commune/voie?codeVoie=${codeVoie}`
      as = `/explore/commune/${codeCommune}/voie/${codeVoie}`
    } else if (type === 'housenumber') {
      href = `/explore/commune/voie?codeCommune=${codeCommune}&codeVoie=${codeVoie}&numero=${numeroComplet}`
      as = `/explore/commune/${codeCommune}/voie/${codeVoie}/numero/${numeroComplet}`
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
