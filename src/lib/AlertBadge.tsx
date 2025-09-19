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

  const cleanMessage = rawMessage.replace(/✅|ℹ️|⚠️|❌|⛔️/g, '').trim()
  const lowerMessage = cleanMessage.toLowerCase()

  if (lowerMessage.includes('traité avec succès')
    || lowerMessage.includes('terminé avec succès')
    || lowerMessage.includes('aucun changement détecté')
    || lowerMessage.includes('révision synchronisée')
    || lowerMessage.includes('liste blanche')
    || lowerMessage.includes('aucun district trouvé')
    || lowerMessage.includes('utilise des banid')
    || lowerMessage.includes('n\'utilise pas de banid')) {
    return null
  }

  // 1. JOB ÉCHOUÉ
  if (lowerMessage.includes('job') && lowerMessage.includes('échoué')) {
    if (cleanMessage.includes('updateDate is a required field')) {
      return 'Date mise à jour manquante'
    }
    return 'Erreur interne contacter le support'
  }

  // 2. DROITS MANQUANTS - afficher message complet
  if (lowerMessage.includes('droits manquants') && lowerMessage.includes('districtids')) {
    // Extraire tout ce qui suit "Droits manquants"
    const match = cleanMessage.match(/droits manquants,\s*(.*)/i)
    if (match) {
      return `Droits manquants, ${match[1]}`
    }
    return 'Droits manquants'
  }

  // 3. OPÉRATION NON AUTORISÉE - afficher tous les IDs
  if (lowerMessage.includes('opération non autorisée') && lowerMessage.includes('éléments font partie')) {
    let result = 'Opération non autorisée\n\nIdentifiants déjà utilisés dans la base:'

    // Extraire les adresses
    const addressMatch = cleanMessage.match(/adresses non autorisées\s*:\s*`([^`]+)`/i)
    if (addressMatch) {
      const addresses = addressMatch[1].split(',').map(id => id.trim())
      result += '\n\nAdresses:'
      addresses.forEach((addr) => {
        result += `\n• ${addr}`
      })
    }

    // Extraire les toponymes
    const toponymMatch = cleanMessage.match(/toponymes non autorisés\s*:\s*`([^`]+)`/i)
    if (toponymMatch) {
      const toponyms = toponymMatch[1].split(',').map(id => id.trim())
      result += '\n\nToponymes:'
      toponyms.forEach((topo) => {
        result += `\n• ${topo}`
      })
    }

    return result
  }

  // 4. SEUIL DE SUPPRESSION - tout afficher en français
  if (lowerMessage.includes('seuil de suppression dépassé')
    || (lowerMessage.includes('exceeded') && (lowerMessage.includes('addresses') || lowerMessage.includes('toponyms')))) {
    let result = 'Seuil de suppression dépassé\n\nDépassé:'

    // Convertir "Exceeded: Addresses: X% (Y/Z), Toponyms: A% (B/C)"
    const addressMatch = cleanMessage.match(/addresses:\s*([0-9.,]+%)\s*\(([0-9,]+)\/([0-9,]+)\)/i)
    const toponymMatch = cleanMessage.match(/toponyms:\s*([0-9.,]+%)\s*\(([0-9,]+)\/([0-9,]+)\)/i)

    if (addressMatch) {
      result += `\nAdresses: ${addressMatch[1]} (${addressMatch[2]}/${addressMatch[3]})`
    }
    if (toponymMatch) {
      result += `\nToponymes: ${toponymMatch[1]} (${toponymMatch[2]}/${toponymMatch[3]})`
    }

    return result
  }

  // 5. DONNÉES MANQUANTES - messages spécifiques
  if (lowerMessage.includes('addressid manquant')) {
    return 'Enregistrement de la BAL sans les identifiants - addressID manquant - Consulter le rapport de validation'
  }
  if (lowerMessage.includes('districtid manquant')) {
    return 'Enregistrement de la BAL sans les identifiants - districtID manquant - Consulter le rapport de validation'
  }
  if (lowerMessage.includes('maintopoid manquant')) {
    return 'Enregistrement de la BAL sans les identifiants - mainTopoID manquant - Consulter le rapport de validation'
  }
  if (lowerMessage.includes('ids manquants')) {
    return 'Enregistrement de la BAL sans les identifiants - IDs manquants - Consulter le rapport de validation'
  }
  if (lowerMessage.includes('enregistrement de la bal sans les identifiants')) {
    return 'Enregistrement de la BAL sans les identifiants - Consulter le rapport de validation'
  }

  // 6. API ERRORS
  if (lowerMessage.includes('api ban') || lowerMessage.includes('api dump')) {
    return 'Erreur interne contactez le support'
  }

  // 7. TIMEOUT
  if (lowerMessage.includes('timeout')) {
    return 'Erreur interne contactez le support'
  }

  // Si aucun pattern reconnu, ne pas afficher
  return null
}

export const AlertBadge: React.FC<AlertBadgeProps> = ({ revision, commune, allRevisions }) => {
  const [shouldShow, setShouldShow] = useState(false)
  const [status, setStatus] = useState<'error' | 'warning' | 'active'>('active')
  const [rawMessage, setRawMessage] = useState('')
  const [label, setLabel] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

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
        /* test dev
        if (revision.isCurrent && revision.id == commune.idRevision) {
          setStatus('error')
          setRawMessage(latestAlert?.message || 'Révision courante non synchronisée avec la base')
          setLabel('Erreur')
          return
        } */

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
        setIsExpanded(false)
      }
    }

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showModal])

  useEffect(() => {
    if (showModal) {
      setIsExpanded(false)
    }
  }, [showModal])

  if (!shouldShow) return null

  // Parser le message seulement quand on a un message
  const displayMessage = parseAlertMessage(rawMessage)

  // Si le parser retourne null pour les messages qu'on ne veut pas afficher, ne pas afficher
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

  const needsExpansion = rawMessage.length > 150

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
                      {/* Message principal - parsé si possible, sinon original */}
                      <div
                        className="fr-alert__title"
                        style={{
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          marginBottom: needsExpansion ? '1rem' : '0',
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {displayMessage || rawMessage}
                      </div>

                      {/* Message technique complet si demandé */}
                      {isExpanded && (
                        <div
                          className="fr-alert__text"
                          style={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            fontSize: '0.9rem',
                            color: '#666',
                            padding: '1rem',
                            backgroundColor: 'rgba(0,0,0,0.05)',
                            borderRadius: '4px',
                          }}
                        >
                          <strong>Message technique original :</strong><br />
                          {rawMessage}
                        </div>
                      )}

                      {/* Bouton pour voir le message technique complet */}
                      {/*                       {needsExpansion && (
                        <div className="fr-mt-2w">
                          {!isExpanded ? (
                            <Button
                              priority="tertiary no outline"
                              size="small"
                              onClick={() => setIsExpanded(true)}
                              iconId="fr-icon-arrow-down-s-line"
                              iconPosition="right"
                            >
                              Voir le message technique
                            </Button>
                          ) : (
                            <Button
                              priority="tertiary no outline"
                              size="small"
                              onClick={() => setIsExpanded(false)}
                              iconId="fr-icon-arrow-up-s-line"
                              iconPosition="right"
                            >
                              Masquer le détail
                            </Button>
                          )}
                        </div>
                      )} */}
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
