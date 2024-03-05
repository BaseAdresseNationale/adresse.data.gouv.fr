import {useState, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'
import {debounce} from 'lodash'
import styled from 'styled-components'
import {X} from 'react-feather'

import {getCommunes} from '@/lib/api-geo'

import {useInput} from '../../../hooks/input'

import SearchInput from '@/components/search-input-legacy'
import RenderCommune from '@/components/search-input-legacy/render-commune'

const StyledContainer = styled.div`
    .search-input-container {
        > input {
            height: unset;
        }
        > span {
            top: 8px;
        }
    }

    .fr-input {
        display: flex;
        justify-content: space-between;

        button {
          background: none;

          &:hover {
            background: none;
          }
        }
    }
`

function CommuneInput({label, hint, isDisabled, onChange, value}) {
  const [input, setInput] = useInput('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = useCallback(debounce(async input => {
    try {
      const results = await getCommunes({q: input, limit: 10, boost: 'population'})
      setResults(results)
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }, 300), [])

  useEffect(() => {
    if (input) {
      setResults([])
      setLoading(true)
      handleSearch(input)
    }
  }, [handleSearch, input])

  return (
    <StyledContainer className={`fr-select-group ${isDisabled ? 'fr-select-group--disabled' : ''}`}>
      <label className='fr-label' htmlFor={`select-${label}`}>
        {label}
        {hint && <span className='fr-hint-text'>{hint}</span>}
      </label>
      {value ?
        <div className='fr-input'>
          {value}
          <button type='button' label='Supprimer' onClick={() => onChange()}>
            <X />
          </button>
        </div> :
        <SearchInput
          value={input}
          results={results}
          isLoading={loading}
          placeholder='Recherchez une commune'
          onSelect={onChange}
          onSearch={setInput}
          renderItem={RenderCommune}
          wrapperStyle={{position: 'relative'}}
          getItemValue={commune => commune.nom} /> }
    </StyledContainer>
  )
}

CommuneInput.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  hint: PropTypes.string,
  isDisabled: PropTypes.bool,
  value: PropTypes.string,
}

export default CommuneInput
