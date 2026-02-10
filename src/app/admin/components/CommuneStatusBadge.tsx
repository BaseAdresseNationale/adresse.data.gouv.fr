import React, { useEffect, useState } from 'react'
import { Badge } from '@codegouvfr/react-dsfr/Badge'
import { getCommuneAlerts, getRevisions } from '@/lib/api-depot'
import { BANCommune } from '@/types/api-ban.types'

interface CommuneStatusBadgeProps {
  commune: BANCommune
}

export function CommuneStatusBadge({ commune }: CommuneStatusBadgeProps) {
  const [status, setStatus] = useState<'error' | 'warning' | 'success' | 'loading'>('loading')
  const [label, setLabel] = useState('Chargement...')

  useEffect(() => {
    const determineStatus = async () => {
      try {
        const [alerts, revisions] = await Promise.all([
          getCommuneAlerts(commune.codeCommune),
          getRevisions(commune.codeCommune),
        ])

        if (!revisions || revisions.length === 0) {
          setStatus('warning')
          setLabel('Aucune révision')
          return
        }

        const referenceRevision = revisions.find(r => r.id === commune.idRevision)
        const currentRevision = revisions.find(r => r.isCurrent)

        if (!currentRevision) {
          setStatus('warning')
          setLabel('Pas de révision courante')
          return
        }

        if (currentRevision && currentRevision.id !== commune.idRevision) {
          if (currentRevision.publishedAt) {
            const publishedDate = new Date(currentRevision.publishedAt)
            const now = new Date()
            const diffInHours = (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60)
            
            if (diffInHours < 1) {
              setStatus('warning')
              setLabel('En cours')
              return
            }
          }

          // Chercher l'alerte la plus récente
          const revisionAlerts = alerts.filter((a: any) => a.revisionId === currentRevision.id)
          const latestAlert = revisionAlerts
            .filter((alert: any) => alert.status === 'warning' || alert.status === 'error')
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

          setStatus('error')
          setLabel(latestAlert?.message?.includes('En cours') ? 'En cours' : 'Erreur')
          return
        }

        if (referenceRevision) {
          const revisionAlerts = alerts.filter((a: any) => a.revisionId === referenceRevision.id)
          const latestAlert = revisionAlerts
            .filter((alert: any) => alert.status === 'warning' || alert.status === 'error')
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

          if (latestAlert?.status === 'warning') {
            setStatus('warning')
            setLabel('Avertissement')
          }
          else if (latestAlert?.status === 'error') {
            setStatus('error')
            setLabel('Erreur')
          }
          else {
            setStatus('success')
            setLabel('Valide')
          }
          return
        }

        // Par défaut
        setStatus('success')
        setLabel('Valide')
      }
      catch (err) {
        console.error('Error determining status:', err)
        setStatus('warning')
        setLabel('Indisponible')
      }
    }

    determineStatus()
  }, [commune])

  if (status === 'loading') {
    return <span className="fr-text--sm fr-text-mention--grey">...</span>
  }

  const getSeverity = () => {
    switch (status) {
      case 'error': return 'error' as const
      case 'warning': return 'warning' as const
      case 'success': return 'success' as const
      default: return 'info' as const
    }
  }

  return <Badge severity={getSeverity()} small>{label}</Badge>
}
