import PropTypes from 'prop-types'
import {Badge} from '@codegouvfr/react-dsfr/Badge'

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
  'ready-to-publish': {
    content: 'Cette Base Adresse Locale est désormais prête à être publiée',
    label: 'Prête à être publiée',
    intent: 'info',
  },
  draft: {
    label: 'Brouillon',
    intent: undefined,
  },
  demo: {
    label: 'Démonstration',
    intent: undefined,
  }
}

function computeStatus(balStatus, sync) {
  if (balStatus === 'replaced' || sync?.status === 'conflict') {
    return STATUSES.conflict
  }

  if (sync?.isPaused) {
    return STATUSES.paused
  }

  if (balStatus === 'published') {
    return STATUSES[sync.status]
  }

  return STATUSES[balStatus]
}

function StatusBadge({status, sync}) {
  const balStatus = computeStatus(status, sync)
  return (
    <Badge noIcon severity={balStatus.intent}>{balStatus.label}</Badge>
  )
}

StatusBadge.defaultProps = {
  sync: undefined,
}

StatusBadge.propTypes = {
  status: PropTypes.oneOf([
    'replaced',
    'published',
    'ready-to-publish',
    'draft',
    'demo',
  ]).isRequired,
  sync: PropTypes.shape({
    isPaused: PropTypes.bool.isRequired,
    status: PropTypes.oneOf([
      'synced',
      'outdated',
      'conflict'
    ]),
  })
}

export default StatusBadge
