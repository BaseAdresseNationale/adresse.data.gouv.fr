import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { Badge } from '@codegouvfr/react-dsfr/Badge'
import { type UserInfo } from '@/hooks/useAuth'
import Loader from '@/components/Loader'
import { useFavorites } from '@/hooks/useFavorites'
import FavoritesList from './FavoritesList'
import AddCommuneModal, { addCommuneModal } from './AddCommuneModal'
import NotificationsBAN, { openCreateSubscriptionModal } from '@/components/NotificationsBAN/NotificationsBAN'
import { ProfileCard, ScrollableCardBody, SectionEditCard } from './DistrictActions/DistrictActions.styles'
import { getStatutsCommunes, type StatutCommune } from '@/lib/api-ban'

interface AccountAdminProps {
  userInfo?: UserInfo | null
}

function getInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return displayName.substring(0, 2).toUpperCase()
}

function AccountAdmin({ userInfo }: AccountAdminProps) {
  const { favorites, addFavorite, removeFavorite, refreshFavorites, count, maxReached, isLoading: favoritesLoading } = useFavorites(userInfo?.sub)
  const [notificationsCount, setNotificationsCount] = useState(0)
  const [statuts, setStatuts] = useState<StatutCommune[]>([])

  useEffect(() => {
    if (favorites.length === 0) {
      setStatuts([])
      return
    }
    let cancelled = false
    const cogs = favorites.map(f => f.codeCommune)
    getStatutsCommunes(cogs)
      .then((res) => {
        if (cancelled) return
        setStatuts(res)
      })
      .catch((err) => {
        console.error('Erreur chargement statuts-communes:', err)
        if (!cancelled) setStatuts([])
      })
    return () => {
      cancelled = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- recalc when count changes only
  }, [favorites.length])

  const statutsByCog = useMemo(() => {
    const map: Record<string, StatutCommune> = {}
    for (const s of statuts) {
      map[s.cog] = s
    }
    return map
  }, [statuts])

  const getDisplayName = () => {
    if (!userInfo) return 'Utilisateur'
    if (userInfo.given_name && userInfo.family_name) return `${userInfo.given_name} ${userInfo.family_name}`
    if (userInfo.given_name && userInfo.usual_name) return `${userInfo.given_name} ${userInfo.usual_name}`
    if (userInfo.name) return userInfo.name
    if (userInfo.usual_name) return userInfo.usual_name
    if (userInfo.email) return userInfo.email
    return 'Utilisateur'
  }

  const getOrganizationName = () => {
    if (!userInfo) return null
    if (userInfo.nom_structure) return userInfo.nom_structure
    if (userInfo.organization?.name) return userInfo.organization.name
    return null
  }

  const displayName = getDisplayName()
  const organizationName = getOrganizationName()

  return (
    <div className="fr-container--fluid">

      <ProfileCard className="fr-mb-3w" role="region" aria-label="Informations du compte">
        <div className="profile__avatar" aria-hidden="true">
          {getInitials(displayName)}
        </div>

        <div className="profile__info">
          <p className="profile__name">{displayName}</p>

          {userInfo?.email && (
            <div className="profile__row">
              <span className="fr-icon fr-icon-mail-line profile__row-icon" aria-hidden="true" />
              <span className="fr-text--sm">{userInfo.email}</span>
            </div>
          )}

          {organizationName && (
            <div className="profile__row">
              <span className="fr-icon fr-icon-building-line profile__row-icon" aria-hidden="true" />
              <span className="fr-text--sm">{organizationName}</span>
            </div>
          )}
        </div>

        <div className="profile__badge-corner">
          <Badge noIcon severity="info" small>ProConnect</Badge>
        </div>
      </ProfileCard>

      <SectionEditCard className="fr-mb-3w">
        <div className="sec-card__header">
          <div className="sec-card__header-left">
            <span className="fr-icon fr-icon-map-pin-2-line sec-card__icon" aria-hidden="true" />
            <div>
              <h3 className="sec-card__title">Mes communes favorites</h3>
              <p className="sec-card__value fr-mb-0">
                {count > 0
                  ? `${count} commune${count > 1 ? 's' : ''} suivie${count > 1 ? 's' : ''}`
                  : 'Suivez l\'état des BAL et accédez rapidement à leurs pages.'}
              </p>
            </div>
          </div>
          {count > 0 && (
            <Button
              type="button"
              priority="secondary"
              iconId="fr-icon-add-line"
              iconPosition="left"
              size="small"
              disabled={maxReached}
              onClick={() => addCommuneModal.open()}
              aria-label={maxReached ? 'Limite de communes atteinte' : 'Ajouter une commune aux favoris'}
            >
              Ajouter une commune
            </Button>
          )}
        </div>
        <div className="sec-card__body sec-card__body--neutral">
          {favoritesLoading
            ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }} aria-busy="true">
                  <Loader size={40} />
                </div>
              )
            : (
                <FavoritesList
                  favorites={favorites}
                  onRemove={removeFavorite}
                  onAdd={() => addCommuneModal.open()}
                  statutsByCog={statutsByCog}
                />
              )}
        </div>
      </SectionEditCard>

      <SectionEditCard className="fr-mb-3w">
        <div className="sec-card__header">
          <div className="sec-card__header-left">
            <span className="fr-icon fr-icon-notification-3-line sec-card__icon" aria-hidden="true" />
            <div>
              <h3 className="sec-card__title">
                Notifications et alertes
                {' '}
                <Badge noIcon severity="info" small>BETA</Badge>
              </h3>
              <p className="sec-card__value fr-mb-0">
                Gérez vos abonnements aux alertes BAN directement depuis votre espace.
              </p>
            </div>
          </div>
          {notificationsCount > 0 && (
            <Button
              type="button"
              priority="secondary"
              iconId="fr-icon-add-line"
              iconPosition="left"
              size="small"
              onClick={() => openCreateSubscriptionModal()}
              aria-label="Créer un nouvel abonnement aux alertes BAN"
            >
              Créer un nouvel abonnement
            </Button>
          )}
        </div>
        <div className="sec-card__body sec-card__body--neutral">
          <ScrollableCardBody style={{ padding: '1.5rem' }}>
            <NotificationsBAN
              embedded
              onSubscriptionsCountChange={setNotificationsCount}
            />
          </ScrollableCardBody>
        </div>
      </SectionEditCard>

      <AddCommuneModal onAdd={addFavorite} onRefresh={refreshFavorites} maxReached={maxReached} />
    </div>
  )
}

export default AccountAdmin
