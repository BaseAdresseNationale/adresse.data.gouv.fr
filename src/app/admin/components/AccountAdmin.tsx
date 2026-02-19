import React from 'react'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { type UserInfo } from '@/hooks/useAuth'
import { useFavorites } from '@/hooks/useFavorites'
import FavoritesList from './FavoritesList'
import AddCommuneModal, { addCommuneModal } from './AddCommuneModal'
import NotificationsBAN from '@/components/NotificationsBAN/NotificationsBAN'

interface AccountAdminProps {
  userInfo?: UserInfo | null
}

function AccountAdmin({ userInfo }: AccountAdminProps) {
  const { favorites, addFavorite, removeFavorite, count, maxReached } = useFavorites(userInfo?.sub)

  const getDisplayName = () => {
    if (!userInfo) return 'Utilisateur'

    // 1. Try given_name + family_name
    if (userInfo.given_name && userInfo.family_name) {
      return `${userInfo.given_name} ${userInfo.family_name}`
    }

    // 2. Try given_name + usual_name
    if (userInfo.given_name && userInfo.usual_name) {
      return `${userInfo.given_name} ${userInfo.usual_name}`
    }

    // 3. Try name (standard OIDC field)
    if (userInfo.name) {
      return userInfo.name
    }

    // 4. Try usual_name alone
    if (userInfo.usual_name) {
      return userInfo.usual_name
    }

    // 5. Fallback to email
    if (userInfo.email) return userInfo.email

    return 'Utilisateur'
  }

  const getOrganizationName = () => {
    if (!userInfo) return null
    if (userInfo.nom_structure) return userInfo.nom_structure
    if (userInfo.organization?.name) return userInfo.organization.name
    return null
  }

  return (
    <div className="fr-container--fluid">
      <section className="fr-mb-6w">
        <h4>Mes informations</h4>
        <p className="fr-hint-text">
          Informations récupérées via ProConnect.
        </p>

        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-12 fr-col-md-6">
            <div className="fr-card fr-card--no-border fr-card--grey">
              <div className="fr-card__body">
                <div className="fr-card__content">
                  <h5 className="fr-card__title">Identité</h5>
                  <p className="fr-card__desc">
                    <strong>Nom :</strong> {getDisplayName()}<br />
                    <strong>Email :</strong> {userInfo?.email || 'Non renseigné'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {(userInfo?.siret || getOrganizationName()) && (
            <div className="fr-col-12 fr-col-md-6">
              <div className="fr-card fr-card--no-border fr-card--grey">
                <div className="fr-card__body">
                  <div className="fr-card__content">
                    <h5 className="fr-card__title">Organisation</h5>
                    <p className="fr-card__desc">
                      {getOrganizationName() && (
                        <><strong>Structure :</strong> {getOrganizationName()}<br /></>
                      )}
                      {userInfo?.siret && (
                        <><strong>SIRET :</strong> {userInfo.siret}</>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="fr-mb-6w">
        <div className="fr-grid-row fr-grid-row--middle fr-grid-row--space-between fr-mb-3w">
          <div className="fr-col-12 fr-col-md-8">
            <h4 className="fr-mb-0">Mes communes favorites</h4>
            {count > 0 && (
              <p className="fr-text--sm fr-text-mention--grey fr-mb-0">
                {count} / 20 commune{count > 1 ? 's' : ''}
              </p>
            )}
          </div>
          {count > 0 && (
            <div className="fr-col-12 fr-col-md-4 fr-text-right">
              <Button
                priority="secondary"
                size="small"
                iconId="fr-icon-add-line"
                onClick={() => addCommuneModal.open()}
                disabled={maxReached}
              >
                Ajouter une commune
              </Button>
            </div>
          )}
        </div>

        {count === 0 && (
          <p className="fr-hint-text">
            Suivez l&apos;état des BAL de vos communes et accédez rapidement à leurs pages.
          </p>
        )}

        <FavoritesList
          favorites={favorites}
          onRemove={removeFavorite}
          onAdd={() => addCommuneModal.open()}
        />

        <AddCommuneModal
          onAdd={addFavorite}
          maxReached={maxReached}
        />
      </section>

      <section className="fr-mb-6w">
        <h4>Notifications et Alertes</h4>
        <p className="fr-hint-text">
          Gérez vos abonnements aux alertes BAN directement depuis votre espace.
        </p>
        <NotificationsBAN embedded />
      </section>
    </div>
  )
}

export default AccountAdmin
