import {useState, useCallback, useEffect} from 'react'
import {useRouter} from 'next/router'
import {debounce} from 'lodash'

import {search, isFirstCharValid} from '@/lib/api-adresse'
import {useInput} from '../hooks/input'

import SearchInput from '@/components/search-input'
import renderAddok from '@/components/search-input/render-addok'

function BanSearch() {
  const [input, setInput] = useInput('')
  const [results, setResults] = useState([])
  const [orderResults, setOrderResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const router = useRouter()

  const handleSelect = feature => {
    const {id} = feature.properties
    router.push(`/base-adresse-nationale?id=${id}`, `/base-adresse-nationale/${id}`)
  }

  const handleSearch = useCallback(debounce(async input => {
    try {
      const results = await search({q: input, limit: 7})
      setResults(
        results.features
          .filter(({properties}) => !['75056', '13055', '69123'].includes(properties.id)) // Filter Paris, Marseille and Lyon
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
        if (!orderResults.some(item => item.header === feature.properties.type)) {
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
    const trimmedInput = input.trim()

    if (trimmedInput.length >= 3) {
      if (isFirstCharValid(trimmedInput)) {
        setResults([])
        setLoading(true)
        setError(null)
        handleSearch(trimmedInput)
      } else {
        setError({message: 'Le premier caractère doit être une lettre ou un chiffre'})
      }
    }
  }, [handleSearch, input])

  useEffect(() => {
    if (input.length <= 3) {
      setResults([])
      setOrderResults([])
    }
  }, [input])

  return (
    <SearchInput
      value={input}
      results={orderResults}
      isLoading={loading}
      placeholder='20 avenue de Ségur, Paris'
      onSelect={handleSelect}
      onSearch={setInput}
      renderItem={renderAddok}
      wrapperStyle={{position: 'relative', minHeight: '4em'}}
      getItemValue={getFeatureValue}
      error={error} />
  )
}

export default BanSearch
