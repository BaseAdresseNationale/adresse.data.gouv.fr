'use client'

import React from 'react'
import { Badge } from '@codegouvfr/react-dsfr/Badge'
import { createModal } from '@codegouvfr/react-dsfr/Modal'

// Un seul modal partagé
const { Component: AlertModal, open: openAlertModal, close: closeAlertModal } = createModal({
  id: 'alert-modal',
  isOpenedByDefault: false,
})

interface AlertBadgeProps {
  status: 'error' | 'warning' | 'success'
  message: string
  label: string
}

export const AlertBadge: React.FC<AlertBadgeProps> = ({ status, message, label }) => {
  const getSeverity = (status: string) => {
    switch (status) {
      case 'error':
        return 'error' as const
      case 'warning':
        return 'warning' as const
      default:
        return 'success' as const
    }
  }

  const getModalTitle = (status: string) => {
    switch (status) {
      case 'error':
        return 'Détail de l\'erreur'
      case 'warning':
        return 'Détail de l\'avertissement'
      default:
        return 'Information'
    }
  }

  const getAlertClass = (status: string) => {
    switch (status) {
      case 'error':
        return 'fr-alert fr-alert--error'
      case 'warning':
        return 'fr-alert fr-alert--warning'
      default:
        return 'fr-alert fr-alert--success'
    }
  }

  return (
    <>
      <span
        style={{ cursor: 'pointer', display: 'inline-block' }}
        onClick={() => openAlertModal()}
        title="Cliquer pour voir le détail"
      >
        <Badge severity={getSeverity(status)}>
          {label}
        </Badge>
      </span>

      <AlertModal
        title={getModalTitle(status)}
        buttons={[
          {
            children: 'Fermer',
            priority: 'primary' as const,
            onClick: () => closeAlertModal(),
          },
        ]}
      >
        <div className={getAlertClass(status)}>
          <h3 className="fr-alert__title">Message détaillé</h3>
          <div
            className="fr-alert__text"
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
            }}
          >
            {message}
          </div>
        </div>
      </AlertModal>
    </>
  )
}
