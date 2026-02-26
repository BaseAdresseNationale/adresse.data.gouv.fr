import React, { useState } from 'react'
import { createModal } from '@codegouvfr/react-dsfr/Modal'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { Input } from '@codegouvfr/react-dsfr/Input'
import { getCommunes } from '@/lib/api-geo'
import { Commune } from '@/types/api-geo.types'

interface AddCommuneModalProps {
  onAdd: (codeCommune: string) => void
  maxReached: boolean
}

const addCommuneModal = createModal({
  id: 'add-commune-modal',
  isOpenedByDefault: false,
})

function AddCommuneModal({ onAdd, maxReached }: AddCommuneModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Commune[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    setError('')

    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await getCommunes({ q: query, limit: 10 })
      setSearchResults(results)
    }
    catch (e) {
      console.error('Search error', e)
      setError('Erreur lors de la recherche')
      setSearchResults([])
    }
    finally {
      setIsSearching(false)
    }
  }

  const handleAddCommune = async (commune: Commune) => {
    try {
      onAdd(commune.code)
      setSearchQuery('')
      setSearchResults([])
      setError('')
      addCommuneModal.close()
    }
    catch (e: any) {
      setError(e.message || 'Erreur lors de l\'ajout')
    }
  }

  return (
    <addCommuneModal.Component
      title="Ajouter une commune favorite"
      buttons={[
        {
          children: 'Annuler',
          priority: 'secondary',
          onClick: () => {
            setSearchQuery('')
            setSearchResults([])
            setError('')
          },
        },
      ]}
    >
      {maxReached && (
        <div className="fr-alert fr-alert--warning fr-alert--sm fr-mb-3w">
          <p>Vous avez atteint le nombre maximum de communes favorites (20).</p>
        </div>
      )}

      <Input
        label="Rechercher une commune"
        hintText="Saisissez un nom ou un code postal"
        nativeInputProps={{
          value: searchQuery,
          onChange: e => handleSearch(e.target.value),
          placeholder: 'Ex: Paris, 75000',
          disabled: maxReached,
        }}
        disabled={maxReached}
      />

      {error && (
        <div className="fr-alert fr-alert--error fr-alert--sm fr-mt-2w">
          <p>{error}</p>
        </div>
      )}

      {isSearching && (
        <div className="fr-mt-3w" style={{ textAlign: 'center' }}>
          <p className="fr-text--sm">Recherche en cours...</p>
        </div>
      )}

      {!isSearching && searchResults.length > 0 && (
        <div className="fr-mt-3w">
          <p className="fr-text--sm fr-text--bold fr-mb-2w">
            {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
          </p>
          <ul className="fr-raw-list">
            {searchResults.map(commune => (
              <li key={commune.code} className="fr-mb-2w">
                <div className="fr-card fr-card--horizontal fr-card--sm fr-card--no-border">
                  <div className="fr-card__body">
                    <div className="fr-card__content">
                      <div className="fr-grid-row fr-grid-row--middle fr-grid-row--space-between">
                        <div className="fr-col">
                          <p className="fr-text--md fr-mb-0">
                            {commune.nom}
                          </p>
                          <p className="fr-text--sm fr-text-mention--grey fr-mb-0">
                            {commune.code} • {commune.codeDepartement} - {commune.codeRegion}
                          </p>
                        </div>
                        <div className="fr-col-auto">
                          <Button
                            priority="secondary"
                            size="small"
                            iconId="fr-icon-add-line"
                            onClick={() => handleAddCommune(commune)}
                            disabled={maxReached}
                          >
                            Ajouter
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
        <div className="fr-mt-3w" style={{ textAlign: 'center' }}>
          <p className="fr-text--sm fr-text-mention--grey">Aucune commune trouvée</p>
        </div>
      )}
    </addCommuneModal.Component>
  )
}

export { addCommuneModal }
export default AddCommuneModal
