import React, { useState } from 'react'
import { createModal } from '@codegouvfr/react-dsfr/Modal'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { Input } from '@codegouvfr/react-dsfr/Input'
import { Tabs } from '@codegouvfr/react-dsfr/Tabs'
import { getCommunes } from '@/lib/api-geo'
import { Commune } from '@/types/api-geo.types'

const TAB_RECHERCHE = 'recherche'
const TAB_LISTE = 'liste'

interface AddCommuneModalProps {
  onAdd: (codeCommune: string, options?: { skipRefresh?: boolean }) => void | Promise<void>
  onRefresh?: () => void | Promise<void>
  maxReached: boolean
}

const addCommuneModal = createModal({
  id: 'add-commune-modal',
  isOpenedByDefault: false,
})

const CODE_COMMUNE_REGEX = /^\d{5}$/

function parseCodeCommunesList(value: string): string[] {
  if (!value.trim()) return []
  return [...new Set(
    value
      .split(',')
      .map(s => s.trim())
      .filter(code => CODE_COMMUNE_REGEX.test(code)),
  )]
}

function AddCommuneModal({ onAdd, onRefresh, maxReached }: AddCommuneModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Commune[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')
  const [listInput, setListInput] = useState('')
  const [bulkAdding, setBulkAdding] = useState(false)
  const [bulkResult, setBulkResult] = useState<{ added: number, already: number, notInBan: number, invalid: number } | null>(null)
  const [selectedTabId, setSelectedTabId] = useState(TAB_RECHERCHE)

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
      await Promise.resolve(onAdd(commune.code))
      setSearchQuery('')
      setSearchResults([])
      setError('')
      setBulkResult(null)
      addCommuneModal.close()
    }
    catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erreur lors de l\'ajout'
      setError(message)
    }
  }

  const handleBulkAdd = async () => {
    const codes = parseCodeCommunesList(listInput)
    const invalidCount = listInput.trim()
      ? listInput.split(',').map(s => s.trim()).filter(s => s && !CODE_COMMUNE_REGEX.test(s)).length
      : 0

    if (codes.length === 0) {
      setError(invalidCount > 0 ? 'Aucun code commune valide (5 chiffres).' : 'Saisissez au moins un code commune.')
      return
    }

    setError('')
    setBulkResult(null)
    setBulkAdding(true)

    let added = 0
    let already = 0
    let notInBan = 0

    for (const code of codes) {
      try {
        await Promise.resolve(onAdd(code, { skipRefresh: true }))
        added += 1
      }
      catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        if (msg.includes('déjà') || msg.includes('favoris')) already += 1
        else if (msg.includes('Base Adresse Nationale') || msg.includes('n\'existe pas')) notInBan += 1
        else if (msg.includes('plus de') && msg.includes('communes')) break
        else setError(msg)
      }
    }

    if (added > 0 && onRefresh) {
      await Promise.resolve(onRefresh())
    }

    setBulkAdding(false)
    setBulkResult({ added, already, notInBan, invalid: invalidCount })
    if (added > 0) setListInput('')
  }

  const resetModal = () => {
    setSearchQuery('')
    setSearchResults([])
    setError('')
    setListInput('')
    setBulkResult(null)
  }

  return (
    <addCommuneModal.Component
      title="Ajouter une commune favorite"
      buttons={[
        {
          children: 'Annuler',
          priority: 'secondary',
          onClick: resetModal,
        },
      ]}
    >
      <div
        style={{
          height: '32rem',
          minHeight: '32rem',
          maxHeight: '32rem',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {maxReached && (
          <div className="fr-alert fr-alert--warning fr-alert--sm fr-mb-3w" style={{ flexShrink: 0 }}>
            <p className="fr-text--sm fr-mb-0">Vous avez atteint le nombre maximum de communes favorites (1000).</p>
          </div>
        )}

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Tabs
            selectedTabId={selectedTabId}
            tabs={[
              { tabId: TAB_RECHERCHE, label: 'Rechercher une commune' },
              { tabId: TAB_LISTE, label: 'Saisir des codes commune' },
            ]}
            onTabChange={(id) => {
              setSelectedTabId(id)
              setError('')
            }}
          >
            {selectedTabId === TAB_RECHERCHE && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
                <Input
                  label="Nom ou code insee"
                  hintText="Saisissez au moins 2 caractères"
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
                    <p className="fr-text--sm fr-mb-0">{error}</p>
                  </div>
                )}
                <div
                  className="fr-mt-2w"
                  style={{
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  }}
                >
                  {isSearching && (
                    <div className="fr-grid-row fr-grid-row--center" style={{ flex: 1, alignItems: 'center' }}>
                      <p className="fr-text--sm fr-mb-0">Recherche en cours...</p>
                    </div>
                  )}
                  {!isSearching && searchResults.length > 0 && (
                    <>
                      <p className="fr-text--sm fr-text--bold fr-mb-1w">
                        {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} — cliquez sur Ajouter
                      </p>
                      <ul
                        className="fr-raw-list"
                        style={{
                          overflowY: 'auto',
                          flex: 1,
                          minHeight: 0,
                          margin: 0,
                          padding: 0,
                          listStyle: 'none',
                        }}
                      >
                        {searchResults.map(commune => (
                          <li key={commune.code} className="fr-mb-1w">
                            <div className="fr-card fr-card--horizontal fr-card--sm fr-card--no-border">
                              <div className="fr-card__body">
                                <div className="fr-card__content">
                                  <div className="fr-grid-row fr-grid-row--middle fr-grid-row--space-between">
                                    <div className="fr-col">
                                      <p className="fr-text--md fr-mb-0">{commune.nom}</p>
                                      <p className="fr-text--sm fr-text-mention--grey fr-mb-0">
                                        {commune.code} • {commune.codeDepartement}
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
                    </>
                  )}
                  {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
                    <div className="fr-grid-row fr-grid-row--center" style={{ flex: 1, alignItems: 'center' }}>
                      <p className="fr-text--sm fr-text-mention--grey fr-mb-0">Aucune commune trouvée</p>
                    </div>
                  )}
                  {!isSearching && searchQuery.length < 2 && (
                    <div className="fr-grid-row fr-grid-row--center" style={{ flex: 1, alignItems: 'center' }}>
                      <p className="fr-text--sm fr-text-mention--grey fr-mb-0">Saisissez au moins 2 caractères pour lancer la recherche</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedTabId === TAB_LISTE && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'auto' }}>
                <p className="fr-text--sm fr-text-mention--grey fr-mb-2w">
                  Saisissez les codes INSEE (5 chiffres) séparés par des virgules.
                </p>
                <Input
                  label="Codes communes"
                  hintText="Exemple : 75056, 13055, 69123"
                  nativeInputProps={{
                    value: listInput,
                    onChange: (e) => {
                      setListInput(e.target.value)
                      setBulkResult(null)
                    },
                    placeholder: '75056, 13055, 69123',
                    disabled: maxReached,
                  }}
                  disabled={maxReached}
                />
                {error && (
                  <div className="fr-alert fr-alert--error fr-alert--sm fr-mt-2w">
                    <p className="fr-text--sm fr-mb-0">{error}</p>
                  </div>
                )}
                {bulkResult && (
                  <div className="fr-mt-2w fr-text--sm">
                    {bulkResult.added > 0 && (
                      <p className="fr-text--success fr-mb-0">
                        {bulkResult.added} commune{bulkResult.added > 1 ? 's' : ''} ajoutée{bulkResult.added > 1 ? 's' : ''}.
                      </p>
                    )}
                    {bulkResult.already > 0 && (
                      <p className="fr-text-mention--grey fr-mb-0">{bulkResult.already} déjà en favoris.</p>
                    )}
                    {bulkResult.notInBan > 0 && (
                      <p className="fr-text-mention--grey fr-mb-0">
                        {bulkResult.notInBan} non présente{bulkResult.notInBan > 1 ? 's' : ''} dans la BAN.
                      </p>
                    )}
                    {bulkResult.invalid > 0 && (
                      <p className="fr-text-mention--grey fr-mb-0">
                        {bulkResult.invalid} code{bulkResult.invalid > 1 ? 's' : ''} invalide{bulkResult.invalid > 1 ? 's' : ''} (ignoré{bulkResult.invalid > 1 ? 's' : ''}).
                      </p>
                    )}
                  </div>
                )}
                <Button
                  type="button"
                  priority="primary"
                  className="fr-mt-2w"
                  disabled={maxReached || bulkAdding || !listInput.trim()}
                  onClick={handleBulkAdd}
                >
                  {bulkAdding ? 'Ajout en cours…' : 'Ajouter la liste'}
                </Button>
              </div>
            )}
          </Tabs>
        </div>
      </div>
    </addCommuneModal.Component>
  )
}

export { addCommuneModal }
export default AddCommuneModal
