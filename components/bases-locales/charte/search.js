import React, {useState, useCallback, useEffect} from 'react'
import {debounce, intersection} from 'lodash'

import {getCommunes, getByCode} from '@/lib/api-geo'
import theme from '@/styles/theme'

import partners from 'partners.json'

import Partners from '@/components/bases-locales/charte/partners'
import SearchInput from '@/components/search-input'
import Tags from '@/components/bases-locales/charte/tags'
import RenderCommune from '@/components/search-input/render-commune'

function PartnersSearchbar() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState([])
  const [commune, setCommune] = useState(null)
  const [filteredPartners, setFilteredPartners] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSelectedTags = tag => {
    setSelectedTags(prevTags => {
      return selectedTags.includes(tag) ?
        selectedTags.filter(selectedTag => selectedTag !== tag) :
        [...prevTags, tag]
    })
  }

  useEffect(() => {
    if (commune) {
      setFilteredPartners(partners.filter(({codeDepartement, isPerimeterFrance}) => (
        codeDepartement.includes(commune.codeDepartement) || isPerimeterFrance)
      ).filter(({services}) => intersection(selectedTags, services).length === selectedTags.length))
    } else {
      setFilteredPartners([])
    }
  }, [selectedTags, commune])

  useEffect(() => {
    setInput(commune ? commune.nom : '')
  }, [commune])

  const handleSearch = useCallback(debounce(async input => {
    setError(null)
    setIsLoading(true)
    try {
      const inputToNumber = Number.parseInt(input, 10)
      if (Number.isNaN(inputToNumber)) {
        setResults(await getCommunes({q: input, limit: 5, boost: 'population'}))
      } else {
        setResults(await getByCode({postalCode: input}))
      }
    } catch {
      setError('Impossible d’effectuer la recherche, veuillez rééssayer ultérieurement')
    }

    setIsLoading(false)
  }, 300), [])

  useEffect(() => {
    if (input) {
      handleSearch(input)
    } else {
      setCommune(null)
      setFilteredPartners([])
      setSelectedTags([])
    }
  }, [handleSearch, input])

  return (
    <div style={{marginTop: '2em'}}>
      <p className='searchbar-label'>Recherchez un partenaire de la Charte de la Base Adresse Locale sur votre territoire</p>
      <SearchInput
        value={input}
        results={results}
        isLoading={isLoading}
        placeholder='Recherchez une commune'
        onSelect={setCommune}
        onSearch={setInput}
        renderItem={RenderCommune}
        getItemValue={commune => commune.nom}
      />

      {commune && (
        <Tags
          onSelectTags={handleSelectedTags}
          selectedTags={selectedTags}
          filteredPartners={filteredPartners}
          allPartners={partners}
        />
      )}

      {commune && (
        filteredPartners.length === 0 ? (
          <div className='results'>Aucune structure n’a été trouvée sur votre territoire </div>
        ) : (
          <div className='results'> <b>{filteredPartners.length} </b>
            {filteredPartners.length === 1 ?
              'partenaire de la Charte de la Base Adresse Locale trouvé sur votre territoire' :
              'partenaires de la Charte de la Base Adresse Locale trouvés sur votre territoire'}
          </div>
        )
      )}

      {error ? <div className='error'>{error}</div> : <Partners searchedPartners={filteredPartners} isDetailed isSearched />}

      <style jsx>{`
        .searchbar-label {
          font-size: 1.1em;
          margin-bottom: 5px;
        }

        .results {
          margin: 0.5em 0 4em 0;
        }

        .error {
          text-align: center;
          font-style: italic;
          color: ${theme.colors.red}
        }
        `}</style>
    </div>
  )
}

export default PartnersSearchbar
