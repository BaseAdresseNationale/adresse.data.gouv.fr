import React, {useState, useCallback, useEffect} from 'react'
import {debounce} from 'lodash'

import {getCommunes} from '../../lib/api-geo'
import {getMairie} from '../../lib/api-etablissements-public'

import {useInput} from '../../hooks/input'

import SearchInput from '../search-input'
import RenderCommune from '../search-input/render-commune'

import Notification from '../notification'
import Loader from '../loader'

import MairieContact from './mairie-contact'

const SearchCommuneContact = () => {
  const [input, setInput] = useInput('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [commune, setCommune] = useState(null)
  const [mairie, setMairie] = useState(null)

  const fetchCommuneContact = useCallback(async () => {
    setLoading(true)
    setMairie(null)

    const results = await getMairie(commune.code)
    const mairie = results.features[0]
    if (mairie) {
      setMairie(results.features[0].properties)
    } else {
      const error = new Error(`Aucune information disponible pour la mairie de ${commune.nom}.`)
      setError(error)
    }

    setLoading(false)
  }, [commune])

  const handleSearch = useCallback(debounce(async input => {
    try {
      const results = await getCommunes({q: input, limit: 10, boost: 'population'})
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
      setError(null)
      fetchCommuneContact()
    }
  }, [commune, fetchCommuneContact])

  return (
    <div className='search-commune-contact'>
      <SearchInput
        value={input}
        results={results}
        isLoading={loading}
        placeholder='Recherchez votre commune'
        onSelect={setCommune}
        onSearch={setInput}
        renderItem={RenderCommune}
        wrapperStyle={{position: 'relative'}}
        getItemValue={commune => commune.nom} />

      {error &&
        <div className='error'>
          <Notification message={error.message} type='error' />
        </div>}

      {commune && loading && !mairie && (
        <div className='loading'>
          <Loader />
          <div>Chargement…</div>
        </div>
      )}

      {mairie && <MairieContact {...mairie} />}

      <style jsx>{`
        .loading {
          display: flex;
          width: 100%;
          height: 150px;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }

        .error {
          margin: 1em 0;
        }
        `}</style>
    </div>
  )
}

export default SearchCommuneContact
