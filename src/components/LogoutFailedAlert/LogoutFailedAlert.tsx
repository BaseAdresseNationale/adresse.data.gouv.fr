'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { Alert } from '@codegouvfr/react-dsfr/Alert'
import { dismissLogoutFailure, hasLogoutFailed, subscribeToLogoutFailure } from '@/utils/logout'

export default function LogoutFailedAlert() {
  const logoutFailed = useSyncExternalStore(subscribeToLogoutFailure, hasLogoutFailed, () => false)
  const containerRef = useRef<HTMLDivElement>(null)

  // L'alerte est en haut de page : une déconnexion partie d'un bouton en bas de page la laisserait hors de l'écran.
  useEffect(() => {
    if (!logoutFailed) return
    containerRef.current?.scrollIntoView({ block: 'start' })
    containerRef.current?.focus({ preventScroll: true })
  }, [logoutFailed])

  if (!logoutFailed) return null

  return (
    <div ref={containerRef} tabIndex={-1} className="fr-container fr-mb-2w">
      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-12">
          <Alert
            severity="error"
            title="Déconnexion impossible"
            description="Votre session n'a pas pu être fermée. Réessayez de vous déconnecter dans quelques instants."
            small
            closable
            onClose={dismissLogoutFailure}
          />
        </div>
      </div>
    </div>
  )
}
