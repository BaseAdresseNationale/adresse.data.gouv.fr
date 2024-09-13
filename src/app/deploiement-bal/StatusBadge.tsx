import { BaseAdresseLocaleStatus, BaseAdresseLocaleSyncStatus, BaseLocaleSync } from '@/types/api-mes-adresses.types'
import { AlertProps } from '@codegouvfr/react-dsfr/Alert'
import { Badge } from '@codegouvfr/react-dsfr/Badge'

const STATUSES = {
  conflict: {
    label: 'Conflit',
    intent: 'error',
  },
  paused: {
    label: 'Suspendue',
    intent: 'warning',
  },
  outdated: {
    label: 'Mise à jour programmée',
    intent: 'new',
  },
  synced: {
    label: 'À jour',
    intent: 'success',
  },
  draft: {
    label: 'Brouillon',
    intent: undefined,
  },
  demo: {
    label: 'Démonstration',
    intent: undefined,
  },
}

function computeStatus(status: BaseAdresseLocaleStatus, sync: BaseLocaleSync) {
  if (status === BaseAdresseLocaleStatus.REPLACED || sync?.status === BaseAdresseLocaleSyncStatus.CONFLICT) {
    return STATUSES.conflict
  }

  if (sync?.isPaused) {
    return STATUSES.paused
  }

  if (status === BaseAdresseLocaleStatus.PUBLISHED) {
    return STATUSES[sync.status as keyof typeof STATUSES]
  }

  return STATUSES[status as keyof typeof STATUSES]
}

interface StatusBadgeProps {
  status: BaseAdresseLocaleStatus
  sync: BaseLocaleSync
}

function StatusBadge({ status, sync }: StatusBadgeProps) {
  const balStatus = computeStatus(status, sync)
  return (
    <Badge noIcon severity={balStatus.intent as AlertProps.Severity}>{balStatus.label}</Badge>
  )
}

export default StatusBadge
