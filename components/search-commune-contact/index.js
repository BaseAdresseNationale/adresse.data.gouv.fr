import React, {useState, useCallback, useEffect} from 'react'
import {debounce} from 'lodash'

import {getCommunes} from '../../lib/api-geo'

import SearchInput from '../search-input'
import RenderCommune from '../search-input/render-commune'

import {useInput} from '../../hooks/input'
import Notification from '../notification'
import {getMairie} from '../../lib/api-etablissements-public'
import MairieContact from './mairie-contact'

const SearchCommuneContact = () => {
  const [input, setInput] = useInput('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [commune, setCommune] = useState(null)
  const [mairie, setMarie] = useState(null)

  const fetchCommuneContact = useCallback(async () => {
    const results = await getMairie(commune.code)
    setMarie(results.features[0].properties)
  }, [commune])

  const handleSearch = useCallback(debounce(async input => {
    try {
      const results = await getCommunes({q: input})
      setResults(results)
    } catch (err) {
      setError(err)
    }

    setLoading(false)
  }, 300), [])

  useEffect(() => {
    if (input) {
      setResults([])
      setError(null)
      setLoading(true)
      handleSearch(input)
    }
  }, [handleSearch, input])

  useEffect(() => {
    if (commune) {
      fetchCommuneContact()
    }
  }, [commune, fetchCommuneContact])

  return (
    <div className='search-commune-contact'>
      <SearchInput
        value={input}
        results={results}
        loading={loading}
        placeholder='Recherchez votre commune'
        onSelect={setCommune}
        onSearch={setInput}
        renderItem={RenderCommune}
        getItemValue={commune => commune.nom} />

      {error &&
        <div className='error'>
          <Notification message={error.message} type='error' />
        </div>}

      {mairie && <MairieContact {...mairie} />}

      <style jsx>{`
        .search-commune-contact {
          position: relative;
        }
        `}</style>
    </div>
  )
}

export default SearchCommuneContact
