/* eslint-disable @stylistic/semi */
/* eslint-disable @stylistic/multiline-ternary */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @stylistic/no-multiple-empty-lines */
'use client'

import React, { useState, useEffect } from 'react'
import Section from '../Section'
import { EmptyStateBox } from '@/app/admin/components/DistrictActions/DistrictActions.styles'
import { Alert } from '@codegouvfr/react-dsfr/Alert'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { createModal } from '@codegouvfr/react-dsfr/Modal'
import { ProConnectButton } from '@codegouvfr/react-dsfr/ProConnectButton'
import LogoutProConnectButtonCustom from '@/components/LogoutProConnectButtonCustom/LogoutProConnectButtonCustom'
import Badge from '@codegouvfr/react-dsfr/Badge'
import Link from 'next/link'
import { useSubscriptions } from './useSubscriptions'
import { SubscriptionForm, SubscriptionTable } from './SubscriptionComponents'
import WebhookGuide from './WebhookGuide'
import { FormData } from './types'
import Loader from '@/components/Loader'
const { Component: CreateModal, open: openCreateModal, close: closeCreateModal } = createModal({
  id: 'create-subscription-modal',
  isOpenedByDefault: false,
})

/** Permet d’ouvrir la modal de création depuis l’en-tête de la section (ex. AccountAdmin). */
export { openCreateModal as openCreateSubscriptionModal }

const { Component: EditModal, open: openEditModal, close: closeEditModal } = createModal({
  id: 'edit-subscription-modal',
  isOpenedByDefault: false,
})

interface NotificationsBANProps {
  embedded?: boolean
  /** En mode embarqué : notifie le parent du nombre d’abonnements (pour afficher le bouton en-tête seulement s’il y en a). */
  onSubscriptionsCountChange?: (count: number) => void
}

function NotificationsBAN({ embedded = false, onSubscriptionsCountChange }: NotificationsBANProps) {
  const {
    authLoading,
    authenticated,
    subscriptions,
    loading,
    actionLoading,
    message,
    editingSubscription,
    isEditing,
    setMessage,
    startEditSubscription,
    cancelEdit,
    createSubscription,
    updateSubscription,
    toggleSubscription,
    deleteSubscription,
  } = useSubscriptions()

  useEffect(() => {
    if (embedded && onSubscriptionsCountChange && !authLoading) {
      onSubscriptionsCountChange(subscriptions.length)
    }
  }, [embedded, onSubscriptionsCountChange, authLoading, subscriptions.length])

  const [formData, setFormData] = useState<FormData>({
    subscriptionName: '',
    webhookURL: '',
    statusesToFollow: [],
    districtsToFollow: '',
    allDistricts: false,
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isFormValid, setIsFormValid] = useState<boolean>(false)

  useEffect(() => {
    const hasWebhookURL = formData.webhookURL.trim() !== ''
    const hasValidURL = isValidURL(formData.webhookURL)
    const hasStatuses = formData.statusesToFollow.length > 0
    const hasDistricts = formData.allDistricts || formData.districtsToFollow.trim() !== ''

    setIsFormValid(hasWebhookURL && hasValidURL && hasStatuses && hasDistricts)
  }, [formData])

  const isValidURL = (url: string): boolean => {
    if (!url.trim()) return false

    try {
      const urlObj = new URL(url)
      return urlObj.protocol === 'https:'
    }
    catch {
      return false
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.webhookURL.trim()) {
      errors.webhookURL = 'L\'URL du webhook est requise'
    }
    else if (!isValidURL(formData.webhookURL)) {
      errors.webhookURL = 'L\'URL doit être valide et en HTTPS'
    }

    if (formData.statusesToFollow.length === 0) {
      errors.statusesToFollow = 'Sélectionnez au moins un type de message'
    }

    if (!formData.allDistricts && !formData.districtsToFollow.trim()) {
      errors.districtsToFollow = 'Saisissez au moins une commune ou cochez "Toutes les communes"'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Fonction d'édition
  const handleEdit = (subscription: any) => {
    startEditSubscription(subscription)
    setFormData({
      subscriptionName: subscription.subscriptionName || '',
      webhookURL: subscription.webhookUrl,
      statusesToFollow: subscription.statusesToFollow,
      districtsToFollow: subscription.districtsToFollow.join(', '),
      allDistricts: subscription.allDistricts || false,
    })
    setFormErrors({})
    openEditModal()
  }

  // Ouverture modal création
  const handleOpenCreateModal = () => {
    resetForm()
    openCreateModal()
  }

  // Fermeture modal création
  const handleCloseCreateModal = () => {
    closeCreateModal()
    resetForm()
  }

  // Fermeture modal édition
  const handleCloseEditModal = () => {
    closeEditModal()
    cancelEdit()
    resetForm()
  }

  // Reset du formulaire
  const resetForm = () => {
    setFormData({
      subscriptionName: '',
      webhookURL: '',
      statusesToFollow: [],
      districtsToFollow: '',
      allDistricts: false,
    })
    setFormErrors({})
  }

  // Submit avec fermeture auto des modales
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      if (isEditing) {
        await updateSubscription(formData)
        // Si on arrive ici, la mise à jour a réussi.
        handleCloseEditModal()
      }
      else {
        await createSubscription(formData)
        // Si on arrive ici, la création a réussi.
        handleCloseCreateModal()
      }
    }
    catch (error) {
      // Les erreurs sont gérées par useSubscriptions via setMessage
    }
  }

  const loginReturnTo = embedded ? '/admin#mon_compte' : '/outils/notifications-ban'
  const loginUrl = `/api/login?return_to=${encodeURIComponent(loginReturnTo)}`

  const renderContent = () => {
    if (authLoading) {
      return (
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-auto fr-mt-4w fr-mb-4w">
            <Loader size={32} />
          </div>
        </div>
      )
    }

    if (!authenticated) {
      return (
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12">
            <p className="fr-text--sm fr-mb-2w">Connectez-vous avec ProConnect pour gérer vos abonnements aux alertes BAN.</p>
            <div className="fr-grid-row fr-grid-row--center">
              <div className="fr-col-auto">
                <ProConnectButton url={loginUrl} />
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-12">
          {!embedded && <h3>Gestion des notifications</h3>}

          {message && (
            <div className="fr-mt-2w">
              <Alert
                severity={message.type}
                title={message.text}
                closable
                onClose={() => setMessage(null)}
              />
            </div>
          )}

          <div className={embedded ? 'fr-mt-2w' : 'fr-mt-4w'}>
            {subscriptions.length > 0
              ? (
                  <>
                    {!embedded && (
                      <div className="fr-mb-2w fr-text-right">
                        <Button
                          iconId="fr-icon-add-line"
                          iconPosition="left"
                          priority="secondary"
                          onClick={handleOpenCreateModal}
                        >
                          Créer un nouvel abonnement
                        </Button>
                      </div>
                    )}

                    <div className={embedded ? '' : 'fr-mt-2w'}>
                      <SubscriptionTable
                        subscriptions={subscriptions}
                        onEdit={handleEdit}
                        onDelete={deleteSubscription}
                        onToggle={toggleSubscription}
                        actionLoading={actionLoading}
                      />
                    </div>
                  </>
                )
              : embedded
                ? (
                    /* En mode embarqué : pas de carte imbriquée ni de bouton (présent dans l’en-tête de section). */
                    <EmptyStateBox className="fr-py-6w fr-px-4w">
                      <span className="fr-icon fr-icon-notification-3-line fr-icon--lg empty-state-icon" aria-hidden="true" />
                      <p className="fr-text--bold fr-mb-0">Aucune notification configurée</p>
                      <p className="fr-text--sm fr-text-mention--grey fr-mb-0 empty-state-desc">
                        Créez un abonnement pour recevoir des alertes BAN sur les communes que vous suivez.
                      </p>
                      <Button
                        priority="secondary"
                        iconId="fr-icon-add-line"
                        iconPosition="left"
                        onClick={handleOpenCreateModal}
                        className="fr-mt-2w"
                      >
                        Créer un abonnement
                      </Button>
                    </EmptyStateBox>
                  )
                : (
                    <div className="fr-card fr-card--grey fr-card--no-border">
                      <div className="fr-card__body">
                        <div className="fr-card__content fr-p-4w fr-text--center">
                          <span className="fr-icon fr-icon-notification-3-line fr-icon--lg fr-text-mention--grey" aria-hidden="true" />
                          <h5 className="fr-mt-3w">Aucune notification configurée</h5>
                          <p className="fr-text--sm fr-text-mention--grey">
                            Créez un abonnement pour recevoir des alertes BAN sur les communes que vous suivez.
                          </p>
                          <Button
                            iconId="fr-icon-add-line"
                            iconPosition="left"
                            priority="secondary"
                            onClick={handleOpenCreateModal}
                            className="fr-mt-3w"
                          >
                            Créer un abonnement
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

            {/* Modal de création */}
            <CreateModal
              title="Créer un nouvel abonnement"
              size="large"
              buttons={[
                {
                  children: 'Annuler',
                  priority: 'secondary' as const,
                  onClick: handleCloseCreateModal,
                  disabled: loading,
                },
              ]}
            >
              <SubscriptionForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                loading={loading}
                isEditing={false}
                isFormValid={isFormValid}
                formErrors={formErrors}
              />
            </CreateModal>

            {/* Modal de modification */}
            <EditModal
              title={`Modifier l'abonnement "${editingSubscription?.subscriptionName || 'Sans nom'}"`}
              size="large"
            >
              <SubscriptionForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                loading={loading}
                isEditing={true}
                onCancel={handleCloseEditModal}
                isFormValid={isFormValid}
                formErrors={formErrors}
              />
            </EditModal>
          </div>
        </div>
      </div>
    )
  }

  if (embedded) {
    return (
      <div className="fr-mt-2w">
        {renderContent()}
        <div className="fr-mt-4w">
          <p className="fr-hint-text fr-mb-0">
            Besoin d&apos;aide pour configurer votre webhook ?{' '}
            <Link href="/outils/notifications-ban" className="fr-link">
              Consultez la documentation notifications BAN
            </Link>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fr-container fr-py-4w">
      {/* En-tête avec bouton de déconnexion */}
      {authenticated && (
        <div className="fr-grid-row fr-grid-row--right fr-mb-2w">
          <div className="fr-col-auto">
            <LogoutProConnectButtonCustom
              text="Se déconnecter"
              loginUrl="/api/logout"
            />
          </div>
        </div>
      )}

      {/* Section principale - Gestion des abonnements */}
      <Section
        title={(
          <>
            Alertes & Notifications BAN{' '}
            <Badge noIcon severity="info">BETA</Badge>
          </>
        )}
        theme="primary"
      >
        <div className="fr-mb-4w">
          <p className="fr-text--sm fr-mb-0">
            Recevez des <strong>alertes automatiques </strong>à la publication d'une Base Adresse Locale,
            avec l'identification des anomalies si la BAL doit être corrigée puis republiée.
            Surveillez les erreurs de format, données manquantes et autres blocages sur les
            communes qui vous intéressent.
          </p>
          <div className="fr-mt-3w">
            <Button
              iconId="fr-icon-question-line"
              iconPosition="left"
              priority="tertiary"
              size="small"
              onClick={() => {
                // Scroll vers le guide
                const guideElement = document.querySelector('[data-guide-container]')
                if (guideElement) {
                  guideElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest',
                  })
                }

                // Ouvrir l'accordéon après le scroll
                setTimeout(() => {
                  const accordionButton = document.querySelector('[data-guide-container] button[aria-expanded="false"]') as HTMLButtonElement
                  if (accordionButton) {
                    accordionButton.click()
                  }
                }, 600)
              }}
            >
              Comment configurer votre abonnement ?
            </Button>
          </div>
        </div>
        {renderContent()}

        {/* Guide webhook - Séparé avec espacement */}
        <div className="fr-mt-6w">
          <WebhookGuide />
        </div>

      </Section>
    </div>
  )
}

export default NotificationsBAN

