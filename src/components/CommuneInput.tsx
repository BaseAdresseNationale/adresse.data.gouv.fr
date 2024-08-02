import { useCallback } from 'react'
import Autocomplete, { StyledResultList } from './Autocomplete'
import { Commune } from '@/types/api-geo.types'
import { getCommunes } from '@/lib/api-geo'
import Button from '@codegouvfr/react-dsfr/Button'

export interface CommuneInputProps {
  value: Commune | null
  onChange: (value: Commune | null) => void
}

export default function CommuneInput({ value, onChange }: CommuneInputProps) {
  const fetchCommunes = useCallback((query: string) => getCommunes({ q: query }), [])

  return value
    ? (
        <div>
          <span>{value.nom}</span>
          <Button
            iconId="fr-icon-close-line"
            onClick={() => onChange(null)}
            priority="tertiary no outline"
            title="Réinitialiser"
          />
        </div>
      )
    : (
        <Autocomplete
          inputProps={{ placeholder: 'Rechercher ma commune' }}
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
