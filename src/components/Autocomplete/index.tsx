import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

export const StyledAutocomplete = styled.div`
  position: relative;
  label {
    margin-bottom: 0.5rem;
    text-align: left;
  }
  .fr-input-group {
    margin-bottom: 0;
  }
  input:focus {
    outline: none;
  }
  .results {
    position: absolute;
    background-color: #fff;
    width: 100%;
    border: 1px solid #ccc;
    border-top: none;
    z-index: 100;
    max-height: 200px;
    overflow-y: auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border-radius: 0 0 4px 4px;

    > p {
      padding: 5px 10px;
      margin: 0;
    }
  }
`

export const StyledResultList = styled.div`
  display: flex;
  flex-direction: column;
  > .result-item {
    padding: 5px;
    > label {
      font-weight: bold;
    }

    > button {
      width: 100%;
      text-align: left;
      padding: 5px 10px;
      &:hover {
        background-color: #eee;
      }
    }
  }

  > .sticky-button {
    padding: 5px;
    background-color: white;
    position: sticky;
    bottom: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

    > button {
      width: 100%;
      text-align: left;
      padding: 5px 10px;
      &:hover {
        background-color: initial;
      }

      @media screen and (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        font-size: 0.9em;
      }
    }
  }
`

interface AutocompleteProps<T> {
  fetchResults: (search: string) => Promise<T[]>
  renderResultList: (results: Array<T>, onBlur: () => void) => React.ReactNode
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  label?: string
}

const Autocomplete = <T extends { code: string }>({
  fetchResults,
  renderResultList,
  inputProps,
  label,
}: AutocompleteProps<T>) => {
  const searchTimeoutRef = useRef({} as NodeJS.Timeout)
  const [hasFocus, setHasFocus] = useState(false)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<T[]>([])

  useEffect(() => {
    async function fetch() {
      if (search.length >= 3) {
        const results = await fetchResults(search)

        setResults(results)
      }
      else {
        setResults([])
      }
    }

    fetch()
  }, [fetchResults, search])

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 3) {
      setSearch(e.target.value)
    }
    else if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      setSearch(e.target.value)
    }, 500)
  }

  return (
    <StyledAutocomplete>
      {label && (
        <label className="fr-label" htmlFor="autocomplete-search">
          {label}
        </label>
      )}
      <div className="fr-input-group fr-search-bar" role="search">
        <input
          className="fr-input"
          onChange={onSearch}
          onFocus={() => setHasFocus(true)}
          onBlur={(e) => {
            if (
              e.relatedTarget instanceof Element
              && e.relatedTarget.tagName === 'BUTTON'
            ) {
              return
            }
            setHasFocus(false)
          }}
          type="search"
          name="autocomplete-search"
          {...inputProps}
        />
        <button className="fr-btn" title="Rechercher">
          Rechercher
        </button>
      </div>
      {hasFocus && (
        <div className="results">
          {results.length > 0
          && renderResultList(results, () => setHasFocus(false))}
          {results.length === 0 && search.length >= 3 && <p>Aucun résultat</p>}
          {results.length === 0 && search.length > 0 && search.length < 3 && (
            <p>Votre recherche doit comporter au moins 3 caractères</p>
          )}
        </div>
      )}
    </StyledAutocomplete>
  )
}

export default Autocomplete
