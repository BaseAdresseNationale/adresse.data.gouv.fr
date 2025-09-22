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

function parseAlertMessage(rawMessage: string): string | null {
  if (!rawMessage) return null

  const lowerMessage = rawMessage.toLowerCase()

  // Messages de succès à ignorer
  if (['traité avec succès', 'terminé avec succès', 'aucun changement détecté', 'révision synchronisée',
    'liste blanche', 'aucun district trouvé', 'utilise des banid', 'n\'utilise pas de banid']
    .some(msg => lowerMessage.includes(msg))) {
    return null
  }

  // JOB ÉCHOUÉ
  if (lowerMessage.includes('job') && lowerMessage.includes('échoué')) {
    return rawMessage.includes('updateDate is a required field')
      ? 'Révision courante non synchronisée avec la base - Date mise à jour manquante'
      : 'Révision courante non synchronisée avec la base - Erreur interne contacter le support'
  }

  // DROITS MANQUANTS
  if (lowerMessage.includes('droits manquants')) {
    const match = rawMessage.match(/droits manquants,\s*(.*)/i)
    return match ? `Révision courante non synchronisée avec la base - Droits manquants, ${match[1]}` : 'Droits manquants'
  }

  // OPÉRATION NON AUTORISÉE
  if (lowerMessage.includes('opération non autorisée')) {
    let result = 'Révision courante non synchronisée avec la base - Opération non autorisée\n\nIdentifiants déjà utilisés dans la base:'

    const addressMatch = rawMessage.match(/adresses non autorisées\s*:\s*`([^`]+)`/i)
    const toponymMatch = rawMessage.match(/toponymes non autorisés\s*:\s*`([^`]+)`/i)

    if (addressMatch) {
      result += '\n\nAdresses:\n' + addressMatch[1].split(',').map(id => `• ${id.trim()}`).join('\n')
    }
    if (toponymMatch) {
      result += '\n\nToponymes:\n' + toponymMatch[1].split(',').map(id => `• ${id.trim()}`).join('\n')
    }

    return result
  }

  // SEUIL DE SUPPRESSION
  if (lowerMessage.includes('seuil de suppression') || lowerMessage.includes('exceeded')) {
    let result = 'Seuil de suppression dépassé\n\nDépassé:'

    const addressMatch = rawMessage.match(/addresses:\s*([0-9.,]+%)\s*\(([0-9,]+)\/([0-9,]+)\)/i)
    const toponymMatch = rawMessage.match(/toponyms:\s*([0-9.,]+%)\s*\(([0-9,]+)\/([0-9,]+)\)/i)

    if (addressMatch) result += `\nAdresses: ${addressMatch[1]} (${addressMatch[2]}/${addressMatch[3]})`
    if (toponymMatch) result += `\nToponymes: ${toponymMatch[1]} (${toponymMatch[2]}/${toponymMatch[3]})`

    return result
  }

  // DONNÉES MANQUANTES - patterns spécifiques
  const missingData = {
    'addressid manquant': 'addressID',
    'districtid manquant': 'districtID',
    'maintopoid manquant': 'mainTopoID',
    'ids manquants': 'IDs',
  }

  for (const [pattern, type] of Object.entries(missingData)) {
    if (lowerMessage.includes(pattern)) {
      // Si déjà dans le nouveau système, pas d'enregistrement mais validation
      if (lowerMessage.includes('le district est enregistré dans le nouveau système')) {
        return `Révision courante non synchronisée avec la base - ${type} manquant - Consulter le rapport de validation`
      }
      return `Enregistrement de la BAL sans les identifiants - ${type} manquant - Consulter le rapport de validation`
    }
  }

  if (lowerMessage.includes('enregistrement de la bal sans les identifiants')) {
    return 'Enregistrement de la BAL sans les identifiants - Consulter le rapport de validation'
  }

  // ERREURS INTERNES
  if (['api ban', 'api dump', 'timeout'].some(err => lowerMessage.includes(err))) {
    return 'Révision courante non synchronisée avec la base - Erreur interne contactez le support'
  }

  return null
}

export const AlertBadge: React.FC<AlertBadgeProps> = ({ revision, commune, allRevisions }) => {
  const [shouldShow, setShouldShow] = useState(false)
  const [status, setStatus] = useState<'error' | 'warning' | 'active'>('active')
  const [rawMessage, setRawMessage] = useState('')
  const [label, setLabel] = useState('')
  const [showModal, setShowModal] = useState(false)

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
          .filter(alert => alert.status === 'warning' || alert.status === 'error')
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

        // Révision courante non synchronisée
        if (revision.isCurrent && revision.id !== commune.idRevision) {
          setStatus('error')
          setRawMessage(latestAlert?.message || 'Révision courante non synchronisée avec la base')
          setLabel('Erreur')
          return
        }
        // Révision de référence
        if (revision.id === commune.idRevision) {
          if (latestAlert?.status === 'warning') {
            setStatus('warning')
            setRawMessage(latestAlert?.message || 'Avertissement détecté')
            setLabel('Avertissement')
          }
          else {
            setStatus('active')
            setRawMessage('Révision synchronisée')
            setLabel('Valide')
          }
          return
        }

        // Révisions intermédiaires
        setStatus('error')
        setRawMessage(latestAlert?.message || 'Révision non validée')
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

  const displayMessage = parseAlertMessage(rawMessage)

  // Ne pas afficher si le parser retourne null pour les messages de succès
  if (displayMessage === null && rawMessage
    && (rawMessage.toLowerCase().includes('traité avec succès')
    || rawMessage.toLowerCase().includes('terminé avec succès')
    || rawMessage.toLowerCase().includes('aucun changement')
    || rawMessage.toLowerCase().includes('liste blanche'))) {
    return null
  }

  const getSeverity = (status: string) => {
    switch (status) {
      case 'error': return 'error' as const
      case 'warning': return 'warning' as const
      default: return 'success' as const
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
            maxWidth: '600px',
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
                        maxHeight: '500px',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                      }}
                    >
                      <div
                        className="fr-alert__title"
                        style={{
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {displayMessage || rawMessage}
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
