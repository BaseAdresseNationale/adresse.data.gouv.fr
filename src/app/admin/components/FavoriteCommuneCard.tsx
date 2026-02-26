import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { Badge } from '@codegouvfr/react-dsfr/Badge'
import { BANCommune } from '@/types/api-ban.types'
import { getCommuneFlagProxy } from '@/lib/api-blasons-communes'

interface FavoriteCommuneCardProps {
  codeCommune: string
  nomCommune: string
  data?: BANCommune
  loading: boolean
  error?: string
  onRemove: () => void
}

function FavoriteCommuneCard({ codeCommune, nomCommune, data, loading, error, onRemove }: FavoriteCommuneCardProps) {
  const [flagUrl, setFlagUrl] = useState<string>('')

  useEffect(() => {
    let isMounted = true
    getCommuneFlagProxy(codeCommune).then((url) => {
      if (isMounted) setFlagUrl(url)
    }).catch(() => {
      // Ignore errors for flags
    })
    return () => {
      isMounted = false
    }
  }, [codeCommune])

  if (loading) {
    return (
      <div className="fr-card fr-card--horizontal fr-card--grey">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <p className="fr-card__title fr-text--md">
              {nomCommune} <span className="fr-text--sm fr-text-mention--grey">({codeCommune})</span>
            </p>
            <p className="fr-text--sm">Chargement...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fr-card fr-card--horizontal fr-card--grey">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <p className="fr-card__title fr-text--md">
              {nomCommune} <span className="fr-text--sm fr-text-mention--grey">({codeCommune})</span>
            </p>
            <p className="fr-text--sm fr-error-text">{error}</p>
          </div>
          <div className="fr-card__footer">
            <Button
              priority="tertiary no outline"
              size="small"
              iconId="fr-icon-delete-line"
              onClick={onRemove}
            >
              Retirer
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const nbAdresses = data?.nbNumeros || 0
  const nbCertifies = data?.nbNumerosCertifies || 0
  const hasBAL = data?.type === 'bal'

  return (
    <div className="fr-card fr-card--horizontal fr-card--grey">
      <div className="fr-card__body">
        <div className="fr-card__content">
          <div className="fr-grid-row fr-grid-row--middle fr-grid-row--space-between">
            <div className="fr-col">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {flagUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={flagUrl}
                    alt={`Logo de ${nomCommune}`}
                    width={32}
                    height={32}
                    style={{ objectFit: 'contain' }}
                  />
                )}
                <div>
                  <p className="fr-card__title fr-text--md fr-mb-0">
                    {nomCommune}
                  </p>
                  <p className="fr-text--sm fr-text-mention--grey fr-mb-0">
                    {codeCommune}
                  </p>
                </div>
              </div>
            </div>
            <div className="fr-col-auto">
              <Button
                priority="tertiary no outline"
                size="small"
                iconId="fr-icon-delete-line"
                iconPosition="right"
                onClick={onRemove}
                title="Retirer des favoris"
              >
                Retirer
              </Button>
            </div>
          </div>

          <div className="fr-mt-3w">
            <div className="fr-badges-group">
              {hasBAL
                ? (
                    <Badge severity="success" small>BAL publiée</Badge>
                  )
                : (
                    <Badge severity="info" small>Pas de BAL</Badge>
                  )}
              {nbCertifies > 0 && (
                <Badge severity="info" small>{nbCertifies.toLocaleString('fr-FR')} certifiée{nbCertifies > 1 ? 's' : ''}</Badge>
              )}
            </div>

            <p className="fr-text--sm fr-mb-0 fr-mt-2w">
              {nbAdresses.toLocaleString('fr-FR')} adresse{nbAdresses > 1 ? 's' : ''} au total
            </p>
          </div>
        </div>
        <div className="fr-card__footer">
          <Link href={`/commune/${codeCommune}`} className="fr-link fr-icon-arrow-right-line fr-link--icon-right">
            Voir la commune
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FavoriteCommuneCard
