import {useState, useCallback, useEffect} from 'react'
import {useRouter} from 'next/router'
import {debounce} from 'lodash'

import {getCommunes, getByCode} from '@/lib/api-geo'
import {useInput} from '@/hooks/input'

import SearchInput from '../search-input'
import RenderCommune from '@/components/search-input/render-commune'
import Notification from '../notification'

function CommuneSearch() {
  const router = useRouter()

  const [input, setInput] = useInput('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = useCallback(debounce(async input => {
    setError(null)
    setIsLoading(true)

    try {
      const inputToNumber = Number.parseInt(input, 10)
      const isInputNumber = !Number.isNaN(inputToNumber)

      const communes = await (isInputNumber ? getByCode({postalCode: input, type: 'type=commune-actuelle,arrondissement-municipal'}) : getCommunes({q: input, limit: 5, boost: 'population', type: 'commune-actuelle,arrondissement-municipal'}))
      setResults(communes.filter(({code}) => !['75056', '13055', '69123'].includes(code))) // Filter Paris, Marseille and Lyon
    } catch {
      setError('Impossible d’effectuer la recherche, veuillez rééssayer ultérieurement')
    }

    setIsLoading(false)
  }, 300), [])

  const handleSelect = commune => {
    router.push(`/commune/${commune.code}`)
  }

  useEffect(() => {
    if (input) {
      handleSearch(input)
    }
  }, [input, handleSearch])

  return (
    <div className='commune-search-section'>
      <p className='searchbar-label'>Recherchez une commune via son nom ou son code postal</p>
      <SearchInput
        value={input}
        results={results}
        placeholder='Paris 11e Arrondissement'
        onSearch={setInput}
        onSelect={handleSelect}
        isLoading={isLoading}
        renderItem={RenderCommune}
        getItemValue={commune => commune.code}
        wrapperStyle={{position: 'relative', minHeight: '4em'}}
      />

      {error &&
      <div className='error'>
        <Notification message={error.message} type='error' />
      </div>}

      <style jsx>{`
        .commune-search-section {
          width: 100%;
        }

        .searchbar-label {
          font-size: 1.1em;
          margin-bottom: 5px;
          text-align: center;
        }

        .error {
          margin: 1em 0;
        }
      `}</style>
    </div>
  )
}

export default CommuneSearch
