'use client'

import Autocomplete, { StyledResultList } from './Autocomplete'
import Button from '@codegouvfr/react-dsfr/Button'
import styled from 'styled-components'

const StyledWrapper = styled.div`
  .name-wrapper {
    display: flex;
    align-items: center;
    height: 40px;

    > button {
      margin-left: 1rem;
    }
  }
`
export interface AutocompleteInputProps {
  label?: string
  value: { nom: string, code: string } | null
  placeholder?: string
  onChange: (value: { nom: string, code: string } | null) => void
  fetchResults: (query: string) => Promise<{ nom: string, code: string }[]>
}

export default function AutocompleteInput({ value, onChange, label, fetchResults, placeholder }: AutocompleteInputProps) {
  return value
    ? (
        <StyledWrapper>
          {label && (
            <label className="fr-label" htmlFor="autocomplete-search">
              {label}
            </label>
          )}
          <div className="name-wrapper">
            <span><b>{value.nom}</b> ({value.code})</span>
            <Button
              iconId="fr-icon-close-line"
              onClick={() => onChange(null)}
              priority="tertiary no outline"
              title="Réinitialiser"
            />
          </div>
        </StyledWrapper>
      )
    : (
        <Autocomplete
          label={label}
          inputProps={{ placeholder }}
          fetchResults={fetchResults}
          renderResultList={(results, onBlur) => (
            <StyledResultList>
              {results.map((result: { nom: string, code: string }) => (
                <div key={result.code} className="result-item">
                  <button
                    tabIndex={0}
                    type="button"
                    onClick={() => {
                      onChange(result)
                      onBlur()
                    }}
                  >
                    {result.nom} ({result.code})
                  </button>
                </div>
              ))}
            </StyledResultList>
          )}
        />
      )
}
