'use client'

import { useCallback } from 'react'
import Autocomplete, { StyledResultList } from './Autocomplete'
import { Commune } from '@/types/api-geo.types'
import { getCommunes } from '@/lib/api-geo'
import Button from '@codegouvfr/react-dsfr/Button'
import styled from 'styled-components'

const StyledWrapper = styled.div`
  .commune-name-wrapper {
    display: flex;
    align-items: center;
    margin-top: 0.5rem;

    > button {
      margin-left: 1rem;
    }
  }
`
export interface CommuneInputProps {
  label?: string
  value?: Partial<Commune>
  placeholder?: string
  onChange: (value?: Commune) => void
}

export default function CommuneInput({ value, onChange, label, placeholder }: CommuneInputProps) {
  const fetchCommunes = useCallback((query: string) => getCommunes({ q: query }), [])

  return value
    ? (
        <StyledWrapper className="fr-input-group">
          {label && (
            <label className="fr-label" htmlFor="autocomplete-search">
              {label}
            </label>
          )}
          <div className="commune-name-wrapper">
            <span><b>{value.nom}</b> ({value.code})</span>
            <Button
              iconId="fr-icon-close-line"
              onClick={() => onChange()}
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
          fetchResults={fetchCommunes}
          renderResultList={(results, onBlur) => (
            <StyledResultList>
              {results.map((result: Commune) => (
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
