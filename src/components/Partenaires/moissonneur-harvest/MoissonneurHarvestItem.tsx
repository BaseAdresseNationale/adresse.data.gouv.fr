import Badge from '@codegouvfr/react-dsfr/Badge'

import Button from '@codegouvfr/react-dsfr/Button'
import { formatDate } from '@/utils/date'
import { getFileLink } from '@/lib/api-moissonneur-bal'
import Tooltip from '@/components/Tooltip'
import UpdateStatusBadge from '../UpdateStatus'
import { HarvestMoissonneurType } from '@/types/api-moissonneur-bal.types'

interface StatusBadgeProps {
  status: string
  error?: string
}

function StatusBadge({ status, error }: StatusBadgeProps) {
  if (status === 'active') {
    return <Badge severity="info" noIcon>En cours…</Badge>
  }

  if (status === 'failed') {
    return (
      <Tooltip message={error}>
        <Badge severity="error" noIcon>Échec</Badge>
      </Tooltip>
    )
  }

  if (status === 'completed') {
    return <Badge severity="success" noIcon>Terminé</Badge>
  }
}

export default function MoissonneurHarvestItem({ startedAt, status, error, updateStatus, updateRejectionReason, fileId }: HarvestMoissonneurType) {
  return (
    <tr>
      <td className="fr-col fr-my-1v">
        <p>{formatDate(startedAt)}</p>
      </td>
      <td className="fr-col fr-my-1v">
        <StatusBadge status={status} error={error} />
      </td>
      <td className="fr-col fr-my-1v">
        {updateStatus && <UpdateStatusBadge status={updateStatus} error={updateRejectionReason} />}
      </td>
      <td className="fr-col fr-my-1v">
        {fileId && (
          <Button linkProps={{ href: getFileLink(fileId) }}>Télécharger</Button>)}
      </td>
    </tr>
  )
}
