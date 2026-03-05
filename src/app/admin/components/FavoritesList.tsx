import React from 'react'
import { Button } from '@codegouvfr/react-dsfr/Button'
import Link from 'next/link'
import { BANCommune } from '@/types/api-ban.types'
import { CommuneStatusBadge } from './CommuneStatusBadge'
import { EmptyStateBox, FavoritesTableWrapper } from './DistrictActions/DistrictActions.styles'

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
  if (!dateString) return '—'
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }
  catch {
    return '—'
  }
}

function getCertLevel(taux: number): 'high' | 'mid' | 'low' {
  if (taux >= 80) return 'high'
  if (taux >= 30) return 'mid'
  return 'low'
}

function FavoritesList({ favorites, onRemove, onAdd }: FavoritesListProps) {
  if (favorites.length === 0) {
    return (
      <EmptyStateBox className="fr-py-6w fr-px-4w">
        <span className="fr-icon fr-icon-map-pin-2-line fr-icon--lg empty-state-icon" aria-hidden="true" />
        <p className="fr-text--bold fr-mb-0">Aucune commune favorite</p>
        <p className="fr-text--sm fr-text-mention--grey fr-mb-0 empty-state-desc">
          Ajoutez des communes pour suivre l&apos;état de leurs adresses et accéder rapidement à leurs pages.
        </p>
        <Button
          priority="secondary"
          iconId="fr-icon-add-line"
          iconPosition="left"
          onClick={onAdd}
          className="fr-mt-2w"
        >
          Ajouter une commune
        </Button>
      </EmptyStateBox>
    )
  }

  return (
    <FavoritesTableWrapper>
      <table className="fr-table fr-table--bordered fr-table--no-caption" aria-label="Mes communes favorites">
        <thead>
          <tr>
            <th scope="col">Commune</th>
            <th scope="col">Code</th>
            <th scope="col">Date révision</th>
            <th scope="col">État BAL</th>
            <th scope="col" className="col-num">Voies</th>
            <th scope="col" className="col-num">Adresses</th>
            <th scope="col" className="col-num">Lieux-dits</th>
            <th scope="col" className="col-num">Certifiées</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {favorites.map((favorite) => {
            const nbVoies = favorite.data?.nbVoies ?? 0
            const nbAdresses = favorite.data?.nbNumeros ?? 0
            const nbCertifies = favorite.data?.nbNumerosCertifies ?? 0
            const nbLieuxDits = favorite.data?.nbLieuxDits ?? 0
            const taux = nbAdresses > 0 ? Math.round((nbCertifies / nbAdresses) * 100) : 0
            const certLevel = getCertLevel(taux)

            if (favorite.loading) {
              return (
                <tr key={favorite.codeCommune}>
                  <td>
                    <span className="fr-text--bold">{favorite.nomCommune}</span>
                  </td>
                  <td className="fr-text--sm fr-text-mention--grey">{favorite.codeCommune}</td>
                  <td colSpan={7} className="fr-text--sm fr-text-mention--grey">
                    Chargement…
                  </td>
                </tr>
              )
            }

            if (favorite.error) {
              return (
                <tr key={favorite.codeCommune}>
                  <td>
                    <span className="fr-text--bold">{favorite.nomCommune}</span>
                  </td>
                  <td className="fr-text--sm fr-text-mention--grey">{favorite.codeCommune}</td>
                  <td colSpan={6} className="fr-text--sm fr-error-text">
                    <span className="fr-icon fr-icon-error-warning-line fr-icon--sm fr-mr-1v" aria-hidden="true" />
                    {favorite.error}
                  </td>
                  <td>
                    <div className="actions-cell">
                      <Button
                        priority="tertiary no outline"
                        size="small"
                        iconId="fr-icon-delete-line"
                        onClick={() => onRemove(favorite.districtID)}
                        title={`Retirer ${favorite.nomCommune} des favoris`}
                      />
                    </div>
                  </td>
                </tr>
              )
            }

            return (
              <tr key={favorite.codeCommune}>
                <td>
                  <Link href={`/commune/${favorite.codeCommune}`} className="fr-link fr-text--bold">
                    {favorite.nomCommune}
                  </Link>
                </td>

                <td className="fr-text--sm fr-text-mention--grey cell-nowrap">
                  {favorite.codeCommune}
                </td>

                <td className="fr-text--sm fr-text-mention--grey cell-nowrap">
                  {formatDate(favorite.data?.dateRevision)}
                </td>

                <td>
                  {favorite.data
                    ? <CommuneStatusBadge commune={favorite.data} />
                    : <span className="fr-text-mention--grey">—</span>}
                </td>

                <td className="col-num">
                  {nbVoies > 0
                    ? nbVoies.toLocaleString('fr-FR')
                    : <span className="col-num--muted">0</span>}
                </td>

                <td className="col-num">
                  {nbAdresses > 0
                    ? nbAdresses.toLocaleString('fr-FR')
                    : <span className="col-num--muted">0</span>}
                </td>

                <td className="col-num">
                  {nbLieuxDits > 0
                    ? nbLieuxDits.toLocaleString('fr-FR')
                    : <span className="col-num--muted">0</span>}
                </td>

                <td className="col-num">
                  {nbAdresses > 0
                    ? (
                        <div className="cert-cell">
                          <span className={`cert-cell__label cert-cell__label--${certLevel}`}>
                            {taux}%
                          </span>
                          <div className="cert-bar" role="progressbar" aria-valuenow={taux} aria-valuemin={0} aria-valuemax={100} aria-label={`${taux}% certifiées`}>
                            <div className={`cert-bar__fill cert-bar__fill--${certLevel}`} style={{ width: `${taux}%` }} />
                          </div>
                          <span className="cert-cell__count">
                            {nbCertifies.toLocaleString('fr-FR')} adr.
                          </span>
                        </div>
                      )
                    : <span className="col-num--muted">—</span>}
                </td>

                <td>
                  <div className="actions-cell">
                    <Button
                      priority="tertiary no outline"
                      size="small"
                      iconId="fr-icon-eye-line"
                      linkProps={{ href: `/commune/${favorite.codeCommune}` }}
                      title={`Voir la fiche de ${favorite.nomCommune}`}
                    />
                    <Button
                      priority="tertiary no outline"
                      size="small"
                      iconId="fr-icon-delete-line"
                      onClick={() => onRemove(favorite.districtID)}
                      title={`Retirer ${favorite.nomCommune} des favoris`}
                    />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </FavoritesTableWrapper>
  )
}

export default FavoritesList
