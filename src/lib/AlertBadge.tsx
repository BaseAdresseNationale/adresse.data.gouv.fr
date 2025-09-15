'use client'

import React, { useEffect, useState } from 'react'
import { Badge } from '@codegouvfr/react-dsfr/Badge'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { getCommuneAlerts } from '@/lib/api-depot'
import { Revision } from '@/types/api-depot.types'
import { BANCommune } from '@/types/api-ban.types'

interface AlertBadgeProps {
  revision: Revision
  commune: BANCommune
  allRevisions: Revision[]
}

export const AlertBadge: React.FC<AlertBadgeProps> = ({ revision, commune, allRevisions }) => {
  const [shouldShow, setShouldShow] = useState(false)
  const [status, setStatus] = useState<'error' | 'warning' | 'active'>('active')
  const [message, setMessage] = useState('')
  const [label, setLabel] = useState('')
  const [showModal, setShowModal] = useState(false)
  const formatMessage = (msg?: string): string => {
    if (!msg) return ''

    // Cherche le premier contenu entre ** **
    const match = msg.match(/\*\*(.*?)\*\*/)
    const extracted = match ? match[1] : msg

    // Coupe à 300 caractères max
    return extracted.slice(0, 300)
  }

  useEffect(() => {
    const determineStatus = async () => {
      if (!revision || !commune || !allRevisions) return

      const referenceRevision = allRevisions.find(r => r.id === commune.idRevision)
      const currentRevision = allRevisions.find(r => r.isCurrent)
      if (!referenceRevision || !currentRevision) return

      const sortedRevisions = [...allRevisions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      const currentIndex = sortedRevisions.findIndex(r => r.isCurrent)
      const referenceIndex = sortedRevisions.findIndex(r => r.id === commune.idRevision)
      const revisionIndex = sortedRevisions.findIndex(r => r.id === revision.id)

      if (revisionIndex < currentIndex || revisionIndex > referenceIndex) {
        setShouldShow(false)
        return
      }

      setShouldShow(true)

      try {
        const alerts = await getCommuneAlerts(commune.codeCommune)
        const revisionAlerts = alerts.filter(a => a.revisionId === revision.id)
        const latestAlert = revisionAlerts
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

        // Révision courante non synchronisée
        if (revision.isCurrent && revision.id !== commune.idRevision) {
          setStatus('error')
          setMessage(formatMessage(latestAlert?.message) || 'Révision courante non synchronisée avec la référence')
          setLabel('Erreur')
          return
        }

        // Révision de référence
        if (revision.id === commune.idRevision) {
          if (latestAlert?.status === 'warning') {
            setStatus('warning')
            setMessage(formatMessage(latestAlert?.message) || 'Avertissement détecté')
            setLabel('Avertissement')
          }
          else {
            setStatus('active')
            setMessage('Révision synchronisée')
            setLabel('Valide')
          }
          return
        }

        // Révisions intermédiaires
        setStatus('error')
        setMessage(formatMessage(latestAlert?.message) || 'Révision non validée')
        setLabel('Erreur')
      }
      catch (err) {
        console.error(err)
        setShouldShow(false)
      }
    }

    determineStatus()
  }, [revision, commune, allRevisions])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.custom-modal') && !target.closest('button')) {
        setShowModal(false)
      }
    }

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showModal])

  if (!shouldShow) return null

  const getSeverity = (status: string) => {
    switch (status) {
      case 'error': return 'error' as const
      case 'warning': return 'warning' as const
      default: return 'success' as const
    }
  }

  const getModalTitle = (status: string) => {
    switch (status) {
      case 'error': return 'Détail de l\'erreur'
      case 'warning': return 'Détail de l\'avertissement'
      default: return 'Information'
    }
  }

  const getAlertType = (status: string) => {
    switch (status) {
      case 'error': return 'error' as const
      case 'warning': return 'warning' as const
      default: return 'success' as const
    }
  }

  return (
    <>
      <Button
        priority="tertiary no outline"
        size="small"
        onClick={() => setShowModal(!showModal)}
        title="Cliquer pour voir le détail"
        className="fr-p-0"
      >
        <Badge severity={getSeverity(status)}>{label}</Badge>
      </Button>

      {showModal && (
        <div
          className="fr-modal fr-modal--opened custom-modal"
          style={{
            position: 'fixed',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            maxWidth: '400px',
            width: 'auto',
            zIndex: 1000,
            background: 'transparent',
          }}
        >
          <div className="fr-container fr-container--fluid fr-container-md">
            <div className="fr-grid-row fr-grid-row--center">
              <div className="fr-col-12">
                <div className="fr-modal__body">
                  <div className="fr-modal__header">
                    <button
                      className="fr-btn--close fr-btn"
                      title="Fermer"
                      onClick={() => setShowModal(false)}
                    >
                      Fermer
                    </button>
                  </div>
                  <div className="fr-modal__content">
                    <div
                      className={`fr-alert fr-alert--${getAlertType(status)}`}
                      style={{
                        maxHeight: '300px',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      <div className="fr-alert__text fr-text--break">
                        {message}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
