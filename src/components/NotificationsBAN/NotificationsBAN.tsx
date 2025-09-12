/* eslint-disable @stylistic/semi */
/* eslint-disable @stylistic/multiline-ternary */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @stylistic/no-multiple-empty-lines */
'use client'

import React, { useState, useEffect } from 'react'
import Section from '../Section'
import { Alert } from '@codegouvfr/react-dsfr/Alert'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { createModal } from '@codegouvfr/react-dsfr/Modal'
import { ProConnectButton } from '@codegouvfr/react-dsfr/ProConnectButton'
import LogoutProConnectButtonCustom from '@/components/LogoutProConnectButtonCustom/LogoutProConnectButtonCustom'
import Badge from '@codegouvfr/react-dsfr/Badge'
import { useSubscriptions } from './useSubscriptions'
import { SubscriptionForm, SubscriptionTable } from './SubscriptionComponents'
import WebhookGuide from './WebhookGuide'
import { FormData } from './types'
import '@codegouvfr/react-dsfr/dsfr/dsfr.min.css';
// Création des modales en dehors du composant

const { Component: CreateModal, open: openCreateModal, close: closeCreateModal } = createModal({
  id: 'create-subscription-modal',
  isOpenedByDefault: false,
})

const { Component: EditModal, open: openEditModal, close: closeEditModal } = createModal({
  id: 'edit-subscription-modal',
  isOpenedByDefault: false,
})

function NotificationsBAN() {
  const {
    authenticated,
    subscriptions,
    hasExistingSubscription,
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

  // Validation des champs
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
        // Fermer la modal d'édition si succès
        if (!loading) {
          handleCloseEditModal()
        }
      }
      else {
        await createSubscription(formData)
        // Fermer la modal de création si succès
        if (!loading) {
          handleCloseCreateModal()
        }
      }
    }
    catch (error) {
      // Les erreurs sont gérées par useSubscriptions via setMessage
    }
  }

  const renderContent = () => {
    if (!authenticated) {
      return (
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12">
            <p>Connectez-vous avec ProConnect pour gérer vos abonnements aux alertes BAN.</p>
            <div className="fr-grid-row fr-grid-row--center">
              <div className="fr-col-auto">
                <ProConnectButton url="/api/login?return_to=/outils/notifications-ban" />
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-12">
          <h3>Gestion des notifications</h3>

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

          {hasExistingSubscription ? (
            <div className="fr-mt-4w">
              <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
                <div className="fr-col-12 fr-col-md-8">
                  <h4>Vos abonnements actuels ({subscriptions.length})</h4>
                </div>
                <div className="fr-col-12 fr-col-md-4 fr-text-right">
                  <Button
                    iconId="fr-icon-add-line"
                    iconPosition="left"
                    priority="secondary"
                    onClick={handleOpenCreateModal}
                  >
                    Créer un nouvel abonnement
                  </Button>
                </div>
              </div>

              <div className="fr-mt-2w">
                <SubscriptionTable
                  subscriptions={subscriptions}
                  onEdit={handleEdit}
                  onDelete={deleteSubscription}
                  onToggle={toggleSubscription}
                  actionLoading={actionLoading}
                />
              </div>

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
          ) : (
            <div className="fr-mt-4w">
              <h4>Créer votre premier abonnement</h4>
              <div className="fr-mt-2w">
                <SubscriptionForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmit}
                  loading={loading}
                  isEditing={false}
                  isFormValid={isFormValid}
                  formErrors={formErrors}
                />
              </div>
            </div>
          )}
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
          <p>
            Recevez des <strong>alertes automatiques</strong> lorsqu'une Base Adresse Locale
            rencontre un problème et doit être corrigée puis republiée.
            Surveillez les erreurs de format, données manquantes et autres blocages
            sur les communes qui vous intéressent.
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
              Comment configurer les webhooks ?
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

