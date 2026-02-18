import React from 'react'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { Badge } from '@codegouvfr/react-dsfr/Badge'
import Link from 'next/link'
import { BANCommune } from '@/types/api-ban.types'
import { CommuneStatusBadge } from './CommuneStatusBadge'

interface FavoriteCommuneWithData {
  districtID: string
  codeCommune: string
  nomCommune: string
  addedAt: string
  data?: BANCommune
  loading: boolean
  error?: string
}

interface FavoritesListProps {
  favorites: FavoriteCommuneWithData[]
  onRemove: (districtID: string) => void
  onAdd: () => void
}

function formatDate(dateString?: string) {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }
  catch {
    return 'N/A'
  }
}

function FavoritesList({ favorites, onRemove, onAdd }: FavoritesListProps) {
  if (favorites.length === 0) {
    return (
      <div className="fr-card fr-card--grey fr-card--no-border">
        <div className="fr-card__body">
          <div className="fr-card__content" style={{ textAlign: 'center', padding: '2rem' }}>
            <span className="fr-icon-map-pin-2-line fr-icon--lg" aria-hidden="true" style={{ fontSize: '3rem', color: 'var(--text-mention-grey)' }}></span>
            <h5 className="fr-mt-3w">Aucune commune favorite</h5>
            <p className="fr-text--sm fr-text-mention--grey">
              Ajoutez des communes pour suivre l&apos;état de leurs adresses et accéder rapidement à leurs pages.
            </p>
            <Button
              priority="secondary"
              iconId="fr-icon-add-line"
              onClick={onAdd}
              className="fr-mt-3w"
            >
              Ajouter une commune
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fr-table fr-table--bordered">
      <table>
        <thead>
          <tr>
            <th scope="col">Commune</th>
            <th scope="col">Code</th>
            <th scope="col">Date révision</th>
            <th scope="col">État BAL</th>
            <th scope="col">Voies</th>
            <th scope="col">Adresses</th>
            <th scope="col">Lieux-dits</th>
            <th scope="col">Certifiées</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {favorites.map((favorite) => {
            const nbVoies = favorite.data?.nbVoies || 0
            const nbAdresses = favorite.data?.nbNumeros || 0
            const nbCertifies = favorite.data?.nbNumerosCertifies || 0
            const nbLieuxDits = favorite.data?.nbLieuxDits || 0
            const dateRevision = favorite.data?.dateRevision
            const tauxCertification = nbAdresses > 0 ? Math.round((nbCertifies / nbAdresses) * 100) : 0

            if (favorite.loading) {
              return (
                <tr key={favorite.codeCommune}>
                  <td>{favorite.nomCommune}</td>
                  <td>{favorite.codeCommune}</td>
                  <td colSpan={7} className="fr-text--sm fr-text-mention--grey">
                    Chargement...
                  </td>
                </tr>
              )
            }

            if (favorite.error) {
              return (
                <tr key={favorite.codeCommune}>
                  <td>{favorite.nomCommune}</td>
                  <td>{favorite.codeCommune}</td>
                  <td colSpan={6} className="fr-text--sm fr-error-text">
                    {favorite.error}
                  </td>
                  <td>
                    <Button
                      priority="tertiary no outline"
                      size="small"
                      iconId="fr-icon-delete-line"
                      onClick={() => onRemove(favorite.districtID)}
                      title="Retirer des favoris"
                    />
                  </td>
                </tr>
              )
            }

            return (
              <tr key={favorite.codeCommune}>
                <td>
                  <Link href={`/commune/${favorite.codeCommune}`} className="fr-link">
                    {favorite.nomCommune}
                  </Link>
                </td>
                <td className="fr-text--sm">{favorite.codeCommune}</td>
                <td className="fr-text--sm fr-text-mention--grey">
                  {formatDate(dateRevision)}
                </td>
                <td>
                  {favorite.data
                    ? (
                        <CommuneStatusBadge commune={favorite.data} />
                      )
                    : (
                        <span className="fr-text--sm fr-text-mention--grey">-</span>
                      )}
                </td>
                <td className="fr-text--sm">{nbVoies.toLocaleString('fr-FR')}</td>
                <td className="fr-text--sm">{nbAdresses.toLocaleString('fr-FR')}</td>
                <td className="fr-text--sm">
                  {nbLieuxDits > 0
                    ? (
                        <span>{nbLieuxDits.toLocaleString('fr-FR')}</span>
                      )
                    : (
                        <span className="fr-text-mention--grey">0</span>
                      )}
                </td>
                <td className="fr-text--sm">
                  {nbCertifies > 0
                    ? (
                        <div>
                          <span className="fr-text--bold">{tauxCertification}%</span>
                          <br />
                          <span className="fr-text--xs fr-text-mention--grey">
                            {nbCertifies.toLocaleString('fr-FR')}
                          </span>
                        </div>
                      )
                    : (
                        <span className="fr-text-mention--grey">0%</span>
                      )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link
                      href={`/commune/${favorite.codeCommune}`}
                      className="fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-icon-eye-line"
                      title="Voir la commune"
                    />
                    <Button
                      priority="tertiary no outline"
                      size="small"
                      iconId="fr-icon-delete-line"
                      onClick={() => onRemove(favorite.districtID)}
                      title="Retirer des favoris"
                    />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default FavoritesList
