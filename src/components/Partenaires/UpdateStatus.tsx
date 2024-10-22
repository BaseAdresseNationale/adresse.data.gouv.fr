import Badge from '@codegouvfr/react-dsfr/Badge'
import Tooltip from '../Tooltip'

interface UpdateStatusBadgeProps {
  status: string
  error?: string
}

export default function UpdateStatusBadge({ status, error }: UpdateStatusBadgeProps) {
  if (status === 'unchanged') {
    return <Badge severity="info" noIcon>Aucun changement</Badge>
  }

  if (status === 'rejected') {
    return (
      <Tooltip message={error}>
        <Badge severity="error" noIcon>Rejeté</Badge>
        <span className="fr-tooltip fr-placement" id="tooltip-2989" role="tooltip" aria-hidden="true">Lorem [...] elit ut.</span>

      </Tooltip>
    )
  }

  if (status === 'updated') {
    return <Badge severity="success" noIcon>Mis à jour</Badge>
  }
}
