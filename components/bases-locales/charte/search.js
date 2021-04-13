import React, {useState, useCallback, useEffect} from 'react'
import {debounce, intersection} from 'lodash'

import {getCommunes} from '@/lib/api-geo'
import theme from '@/styles/theme'

import partners from 'partners.json'

import Partners from '@/components/bases-locales/charte/partners'
import SearchInput from '@/components/search-input'
import RenderCommune from '@/components/search-input/render-commune'

const labels = [
  {id: 'accompagnement technique', value: 'Accompagnement technique'},
  {id: 'diffusion', value: 'Diffusion'},
  {id: 'mise à disposition outils mutualisés', value: 'Mise à disposition d’outils mutualisés'},
  {id: 'formation', value: 'Formation'},
  {id: 'réalisation de bases adresse locales', value: 'Réalisation de Base Adresse Locales'},
  {id: 'animation', value: 'Animation'}
]

function PartnersSearchbar() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState([])
  const [commune, setCommune] = useState(null)
  const [filteredPartners, setFilteredPartners] = useState([])
  const [selectedLabels, setSelectedLabels] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLabels = label => {
    setSelectedLabels(prevLabels => {
      return selectedLabels.includes(label) ?
        selectedLabels.filter(selectedLabel => selectedLabel !== label) :
        [...prevLabels, label]
    })
  }

  useEffect(() => {
    if (commune) {
      setFilteredPartners(partners.filter(({codeDepartement, isPerimeterFrance}) => (
        codeDepartement.includes(commune.departement.code) || isPerimeterFrance)
      ).filter(({services}) => intersection(selectedLabels, services).length === selectedLabels.length))
    } else {
      setFilteredPartners([])
    }
  }, [selectedLabels, commune])

  useEffect(() => {
    setInput(commune ? commune.nom : '')
  }, [commune])

  const handleSearch = useCallback(debounce(async input => {
    setError(null)
    setIsLoading(true)
    try {
      const results = await getCommunes({q: input, fields: ['departement'], limit: 5, boost: 'population'})
      setResults(results)
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
    }
  }, [handleSearch, input])

  return (
    <div style={{marginTop: '2em'}}>
      <p className='searchbar-label'>Recherchez une structure de mutualisation sur votre territoire</p>
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
      <div className='labels-container'>
        {labels.map(label => {
          return (
            <div
              onClick={() => {
                handleLabels(label.id)
              }}
              key={label.id}
              className={selectedLabels.includes(label.id) ? 'label label-active' : 'label'}
            >
              {label.value}
            </div>
          )
        })}
      </div>
      {commune && (
        filteredPartners.length === 0 ? (
          <div className='results'>Aucune structure n’a été trouvée sur votre territoire </div>
        ) : (
          <div className='results'> <b>{filteredPartners.length} </b>
            {filteredPartners.length === 1 ?
              'structure de mutualisation a été trouvée sur votre territoire' :
              'structures de mutualisation ont été trouvées sur votre territoire'}
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
          margin-top: 0.5em;
        }

        .labels-container {
          margin: 1.5em 0 1em 0;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
        }

        .label {
          font-size: 1.1em;
          background-color: ${theme.colors.lightGrey};
          box-shadow: 5px 5px 2px -9px ${theme.colors.grey};
          border-radius: 4px;
          font-style: italic;
        }

        .label-active {
          color: ${theme.colors.white};
          background-color: ${theme.colors.blue};
        }

        .label {
          cursor: pointer;
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
