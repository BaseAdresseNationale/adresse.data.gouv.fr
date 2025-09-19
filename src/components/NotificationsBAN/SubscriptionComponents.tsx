/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react'
import { Input } from '@codegouvfr/react-dsfr/Input'
import { Checkbox } from '@codegouvfr/react-dsfr/Checkbox'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { Table } from '@codegouvfr/react-dsfr/Table'
import { ToggleSwitch } from '@codegouvfr/react-dsfr/ToggleSwitch'
import { NotificationSubscription, FormData, SubscriptionFormProps, SubscriptionTableProps } from './types'
import { createModal } from '@codegouvfr/react-dsfr/Modal'

export const DeleteButtonWithConfirm: React.FC<{
  onConfirm: () => void
  loading?: boolean
  subscriptionName?: string
  subscriptionId: string // Ajout pour créer un ID unique
}> = ({ onConfirm, loading, subscriptionName, subscriptionId }) => {
  // Créer un modal unique pour ce bouton avec l'ID de l'abonnement
  const modalId = `confirm-delete-${subscriptionId}`
  const { Component: ConfirmDeleteModal, open: openConfirmDeleteModal, close: closeConfirmDeleteModal } = createModal({
    id: modalId,
    isOpenedByDefault: false,
  })

  const handleConfirm = () => {
    onConfirm()
    closeConfirmDeleteModal()
  }

  return (
    <>
      <Button
        iconId="fr-icon-delete-bin-line"
        priority="tertiary no outline"
        size="small"
        onClick={() => openConfirmDeleteModal()}
        disabled={loading}
        title="Supprimer l'abonnement"
      >
        {loading ? 'Suppression...' : ''}
      </Button>

      <ConfirmDeleteModal
        title="Confirmer la suppression"
        buttons={[
          {
            children: 'Annuler',
            priority: 'secondary' as const,
            onClick: () => closeConfirmDeleteModal(),
          },
          {
            children: 'Supprimer définitivement',
            priority: 'primary' as const,
            onClick: handleConfirm,
            disabled: loading,
          },
        ]}
      >
        <p>Êtes-vous sûr de vouloir supprimer l&apos;abonnement "<strong>{subscriptionName || 'Sans nom'}</strong>" ?</p>
        <p><em>Cette action est irréversible.</em></p>
      </ConfirmDeleteModal>
    </>
  )
}

export const CommunesCell: React.FC<{ subscription: NotificationSubscription }> = ({ subscription }) => {
  if (subscription.allDistricts) {
    return <span>Toutes les communes</span>
  }

  if (!subscription.districtsToFollow || subscription.districtsToFollow.length === 0) {
    return <span>Toutes les communes</span>
  }

  return (
    <details>
      <summary>
        {subscription.districtsToFollow.length} commune{subscription.districtsToFollow.length > 1 ? 's' : ''}
      </summary>
      <div>
        {subscription.districtsToFollow.join(', ')}
      </div>
    </details>
  )
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  loading,
  isEditing,
  onCancel,
  isFormValid,
  formErrors,
}) => {
  const handleStatusChange = (status: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      statusesToFollow: checked
        ? [...prev.statusesToFollow, status]
        : prev.statusesToFollow.filter(s => s !== status),
    }))
  }

  const handleAllDistrictsChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      allDistricts: checked,
      districtsToFollow: checked ? '' : prev.districtsToFollow,
    }))
  }

  return (
    <form onSubmit={onSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Input
          label="Identifiant de l'alerte"
          hintText="Nom pour identifier cet abonnement"
          nativeInputProps={{
            value: formData.subscriptionName,
            onChange: e => setFormData(prev => ({ ...prev, subscriptionName: e.target.value })),
            placeholder: 'Commune de Bayonne, GEOPAL...',
            maxLength: 255,
          }}
        />

        <Input
          label="URL du webhook"
          hintText="L'URL doit être en HTTPS et accessible publiquement"
          nativeInputProps={{
            type: 'url',
            value: formData.webhookURL,
            onChange: e => setFormData(prev => ({ ...prev, webhookURL: e.target.value })),
            placeholder: 'https://mon-service.fr/webhooks/ban-alerts',
            required: true,
            disabled: isEditing,
          }}
          state={formErrors.webhookURL ? 'error' : 'default'}
          stateRelatedMessage={formErrors.webhookURL || (isEditing ? 'L\'URL du webhook ne peut pas être modifiée' : undefined)}
        />

        <div>
          <fieldset>
            <legend>Types de messages à recevoir</legend>
            {[
              { value: 'success', label: 'Succès' },
              { value: 'error', label: 'Erreurs' },
              { value: 'warning', label: 'Avertissements' },
              { value: 'info', label: 'Informations' },
            ].map(({ value, label }) => (
              <Checkbox
                key={value}
                options={[{
                  label,
                  nativeInputProps: {
                    checked: formData.statusesToFollow.includes(value),
                    onChange: e => handleStatusChange(value, e.target.checked),
                  },
                }]}
              />
            ))}
          </fieldset>
          {formErrors.statusesToFollow && (
            <p>
              {formErrors.statusesToFollow}
            </p>
          )}
        </div>

        <Checkbox
          options={[{
            label: 'Recevoir les alertes de toutes les communes',
            nativeInputProps: {
              checked: formData.allDistricts,
              onChange: e => handleAllDistrictsChange(e.target.checked),
            },
          }]}
        />

        {!formData.allDistricts && (
          <Input
            label="Codes communes (séparés par des virgules)"
            hintText="Exemple: 64102,78800,13001"
            nativeInputProps={{
              value: formData.districtsToFollow,
              onChange: e => setFormData(prev => ({ ...prev, districtsToFollow: e.target.value })),
              placeholder: '64102,78800,13001',
              disabled: formData.allDistricts,
            }}
            state={formErrors.districtsToFollow ? 'error' : 'default'}
            stateRelatedMessage={formErrors.districtsToFollow}
          />
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button
            type="submit"
            disabled={loading || !isFormValid}
          >
            {loading
              ? (isEditing ? 'Modification en cours...' : 'Création en cours...')
              : (isEditing ? 'Modifier l\'abonnement' : 'Créer l\'abonnement')}
          </Button>

          {isEditing && onCancel && (
            <Button
              type="button"
              priority="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Annuler
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}

export const SubscriptionTable: React.FC<SubscriptionTableProps> = ({
  subscriptions,
  onEdit,
  onDelete,
  onToggle,
  actionLoading,
}) => {
  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    }
    catch {
      return dateString
    }
  }

  if (subscriptions.length === 0) return null

  const tableData = subscriptions.map(sub => [
    sub.subscriptionName || 'Sans nom',
    (
      <div
        key={`webhook-${sub.id}`}
        style={{
          maxWidth: '300px',
          wordBreak: 'break-all',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        title={sub.webhookUrl}
      >
        {sub.webhookUrl}
      </div>
    ),
    sub.statusesToFollow.join(', '),
    <CommunesCell key={`communes-${sub.id}`} subscription={sub} />,
    formatDate(sub.createdAt),
    (
      <ToggleSwitch
        key={sub.id}
        checked={sub.isActive}
        onChange={checked => onToggle(sub.id, checked)}
        label=""
        inputTitle={`${sub.isActive ? 'Désactiver' : 'Activer'} l'abonnement`}
        disabled={actionLoading === sub.id}
      />
    ),
    (
      <div key={`actions-${sub.id}`} style={{ display: 'flex', gap: '0.5rem' }}>
        <Button
          iconId="fr-icon-edit-fill"
          priority="tertiary no outline"
          size="small"
          onClick={() => onEdit(sub)}
          title="Modifier l'abonnement"
          disabled={actionLoading === sub.id}
        />
        <DeleteButtonWithConfirm
          onConfirm={() => onDelete(sub.id)}
          loading={actionLoading === sub.id}
          subscriptionName={sub.subscriptionName}
          subscriptionId={sub.id} // ← Ajout de l'ID unique
        />
      </div>
    ),
  ])

  return (
    <Table
      headers={['Nom', 'Webhook URL', 'Types de messages', 'Communes', 'Créé le', 'Statut', 'Actions']}
      data={tableData}
    />
  )
}
