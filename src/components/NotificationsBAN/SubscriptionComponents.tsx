import React, { useState, useEffect } from 'react'
import { Input } from '@codegouvfr/react-dsfr/Input'
import { Checkbox } from '@codegouvfr/react-dsfr/Checkbox'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { ToggleSwitch } from '@codegouvfr/react-dsfr/ToggleSwitch'
import { NotificationSubscription, FormData, SubscriptionFormProps, SubscriptionTableProps } from './types'
import { createModal } from '@codegouvfr/react-dsfr/Modal'
import { FavoritesTableWrapper } from '@/app/admin/components/DistrictActions/DistrictActions.styles'

export const DeleteButtonWithConfirm: React.FC<{
  onConfirm: () => void
  loading?: boolean
  subscriptionName?: string
  subscriptionId: string
}> = ({ onConfirm, loading, subscriptionName, subscriptionId }) => {
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
        <p className="fr-text--sm fr-mb-2w">Êtes-vous sûr de vouloir supprimer l&apos;abonnement &quot;<strong>{subscriptionName || 'Sans nom'}</strong>&quot; ?</p>
        <p className="fr-text--sm fr-text-mention--grey fr-mb-0"><em>Cette action est irréversible.</em></p>
      </ConfirmDeleteModal>
    </>
  )
}

export const CommunesCell: React.FC<{ subscription: NotificationSubscription }> = ({ subscription }) => {
  if (subscription.allDistricts) {
    return <span className="fr-text--sm">Toutes les communes</span>
  }

  if (!subscription.districtsToFollow || subscription.districtsToFollow.length === 0) {
    return <span className="fr-text--sm">Toutes les communes</span>
  }

  return (
    <details className="fr-text--sm">
      <summary className="fr-link">
        {subscription.districtsToFollow.length} commune{subscription.districtsToFollow.length > 1 ? 's' : ''}
      </summary>
      <div className="fr-mt-1v">
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
      <div className="fr-flex fr-flex--column fr-gap-6w">
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
          <fieldset className="fr-fieldset">
            <legend className="fr-fieldset__legend fr-text--bold">Types de messages à recevoir</legend>
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
            <p className="fr-error-text fr-text--sm fr-mt-1w">
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

        <div className="fr-flex fr-gap-4w">
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

  return (
    <FavoritesTableWrapper>
      <table aria-label="Vos abonnements aux alertes BAN">
        <thead>
          <tr>
            <th scope="col">Nom</th>
            <th scope="col">Webhook URL</th>
            <th scope="col">Types de messages</th>
            <th scope="col">Communes</th>
            <th scope="col" className="cell-nowrap">Créé le</th>
            <th scope="col">Statut</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map(sub => (
            <tr key={sub.id}>
              <td className="fr-text--bold cell-nowrap">
                {sub.subscriptionName || <span className="fr-text-mention--grey">Sans nom</span>}
              </td>

              <td>
                <div className="cell-webhook" title={sub.webhookUrl}>
                  {sub.webhookUrl}
                </div>
              </td>

              <td className="fr-text--sm">
                {sub.statusesToFollow.join(', ')}
              </td>

              <td className="fr-text--sm">
                <CommunesCell subscription={sub} />
              </td>

              <td className="fr-text--sm fr-text-mention--grey cell-nowrap">
                {formatDate(sub.createdAt)}
              </td>

              <td>
                <ToggleSwitch
                  checked={sub.isActive}
                  onChange={checked => onToggle(sub.id, checked)}
                  label={sub.isActive ? 'Actif' : 'Inactif'}
                  inputTitle={`${sub.isActive ? 'Désactiver' : 'Activer'} l'abonnement`}
                  disabled={actionLoading === sub.id}
                  showCheckedHint={false}
                  labelPosition="right"
                />
              </td>

              <td>
                <div className="actions-cell">
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
                    subscriptionId={sub.id}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </FavoritesTableWrapper>
  )
}
