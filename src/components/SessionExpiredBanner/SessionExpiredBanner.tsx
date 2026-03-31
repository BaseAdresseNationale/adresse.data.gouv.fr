'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Alert } from '@codegouvfr/react-dsfr/Alert'
import { SESSION_EXPIRED_REASON } from '@/utils/sessionExpired'

const BANNER_DURATION_MS = 8000

export default function SessionExpiredBanner() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [showBanner, setShowBanner] = useState(false)

  const reason = searchParams?.get('reason') ?? null
  const hasReason = reason === SESSION_EXPIRED_REASON

  const closeBanner = useCallback(() => {
    setShowBanner(false)
  }, [])

  useEffect(() => {
    if (!hasReason || !searchParams) return
    setShowBanner(true)
    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.delete('reason')
    const query = nextParams.toString()
    const url = pathname + (query ? `?${query}` : '')
    router.replace(url, { scroll: false })
    const timer = setTimeout(closeBanner, BANNER_DURATION_MS)
    return () => clearTimeout(timer)
    // pathname + searchParams pour construire l'URL de remplacement ; on évite searchParams en dépendance pour ne pas relancer l'effet après replace
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasReason, pathname, router])

  if (!showBanner) return null

  return (
    <div className="fr-container fr-mb-2w">
      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-12">
          <Alert
            severity="warning"
            title="Session expirée"
            description="Votre session a expiré. Veuillez vous reconnecter pour accéder à vos fonctionnalités."
            small
            closable
            onClose={closeBanner}
          />
        </div>
      </div>
    </div>
  )
}
