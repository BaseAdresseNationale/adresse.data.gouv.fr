import {useState, useCallback, useEffect, useMemo} from 'react'
import {debounce, intersection} from 'lodash'

import {getCommunes, getByCode} from '@/lib/api-geo'
import theme from '@/styles/theme'

import companies from '@/data/partners/companies.json'
import epci from '@/data/partners/epci.json'
import communes from '@/data/partners/communes.json'

import SearchPartnersResults from '@/components/bases-locales/charte/search-partners-results'
import SearchInput from '@/components/search-input'
import Tags from '@/components/bases-locales/charte/tags'
import RenderCommune from '@/components/search-input/render-commune'

const ALL_PARTNERS = [...companies, ...epci, ...communes]

function PartnersSearchbar() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState([])
  const [commune, setCommune] = useState(null)
  const [filteredPartners, setFilteredPartners] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const [communePartners, companyPartners, organizationPartners] = useMemo(() => [
    filteredPartners.filter(partner => partner.echelon === 0),
    filteredPartners.filter(partner => partner.isCompany),
    filteredPartners.filter(partner => !partner.isCompany && partner.echelon !== 0)
  ], [filteredPartners])

  const handleSelectedTags = tag => {
    setSelectedTags(prevTags => {
      return selectedTags.includes(tag) ?
        selectedTags.filter(selectedTag => selectedTag !== tag) :
        [...prevTags, tag]
    })
  }

  const getAvailablePartners = useCallback((communeCodeDepartement, tags) => {
    const filteredByPerimeter = ALL_PARTNERS.filter(({codeDepartement, isPerimeterFrance}) => (codeDepartement.includes(communeCodeDepartement) || isPerimeterFrance))
    const filteredByTags = filteredByPerimeter.filter(({services}) => intersection(tags, services).length === tags.length)

    return filteredByTags.sort((a, b) => {
      return a.echelon - b.echelon
    })
  }, [])

  useEffect(() => {
    if (commune) {
      const availablePartners = getAvailablePartners(commune.codeDepartement, selectedTags)
      setFilteredPartners(availablePartners)
    } else {
      setFilteredPartners([])
    }
  }, [selectedTags, getAvailablePartners, commune])

  useEffect(() => {
    setInput(commune ? commune.nom : '')
  }, [commune])

  const handleSearch = useCallback(debounce(async input => {
    setError(null)
    setIsLoading(true)
    try {
      const inputToNumber = Number.parseInt(input, 10)
      const isInputNumber = !Number.isNaN(inputToNumber)

      const commune = await (isInputNumber ? getByCode({postalCode: input}) : getCommunes({q: input, limit: 5, boost: 'population'}))

      setResults(commune)
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
      <p className='searchbar-label'>Recherchez un partenaire de la Charte de la Base Adresse Locale dans votre département</p>
      <SearchInput
        value={input}
        results={results}
        isLoading={isLoading}
        placeholder='Recherchez une commune'
        onSelect={setCommune}
        onSearch={setInput}
        renderItem={RenderCommune}
        getItemValue={commune => commune.nom}
        wrapperStyle={{position: 'relative'}}
      />

      {commune && (
        <Tags
          onSelectTags={handleSelectedTags}
          selectedTags={selectedTags}
          filteredPartners={filteredPartners}
          allPartners={[...epci, ...companies, ...communes]}
        />
      )}

      {commune && (
        filteredPartners.length === 0 ? (
          <div className='results'>Aucune structure n’a été trouvée sur votre territoire </div>
        ) : (
          <div className='results'>
            <div> <b>{filteredPartners.length} </b>
              {filteredPartners.length === 1 ?
                'partenaire de la Charte de la Base Adresse Locale trouvé dans votre département' :
                'partenaires de la Charte de la Base Adresse Locale trouvés dans votre département'}
            </div>

            <div className='organizations'>
              <div><b>{communePartners.length}</b> {`${communePartners.length > 1 ? 'communes' : 'commune'} de mutualisation`}</div>
              <div><b>{organizationPartners.length}</b> {`${organizationPartners.length > 1 ? 'organismes' : 'organisme'} de mutualisation`}</div>
              <div><b>{companyPartners.length}</b> {companyPartners.length > 1 ? 'entreprises' : 'entreprises'}</div>
            </div>
          </div>
        )
      )}

      {error ? (
        <div className='error'>{error}</div>
      ) : (
        filteredPartners.length > 0 && <SearchPartnersResults companies={companyPartners} organizations={organizationPartners} communes={communePartners} />
      )}

      <style jsx>{`
        .searchbar-label {
          font-size: 1.1em;
          margin-bottom: 5px;
        }

        .results {
          margin: 0.5em 0 4em 0;
        }

        .organizations {
          margin-top: 5px;
          padding-left: 10px;
          border-left: ${theme.border} solid 3px;
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
