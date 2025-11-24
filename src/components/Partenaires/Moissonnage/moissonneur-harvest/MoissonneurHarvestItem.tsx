import Button from '@codegouvfr/react-dsfr/Button'
import { formatDate } from '@/utils/date'
import { getFileLink } from '@/lib/api-moissonneur-bal'
import { HarvestMoissonneurType } from '@/types/api-moissonneur-bal.types'
import StatusBadgeHarvest from './StatusBadgeHarvest'

interface StatusBadgeProps {
  status: string
  error?: string
}

export default function MoissonneurHarvestItem({ startedAt, status, error, updateStatus, updateRejectionReason, fileId }: HarvestMoissonneurType) {
  return (
    <tr>
      <td className="fr-col fr-my-1v">
        <p>{formatDate(startedAt)}</p>
      </td>
      <td className="fr-col fr-my-1v">
        <StatusBadgeHarvest
          status={status}
          error={error}
          updateStatus={updateStatus}
          updateRejectionReason={updateRejectionReason}
        />
      </td>
      <td className="fr-col fr-my-1v">
        {fileId && (
          <Button linkProps={{ href: getFileLink(fileId) }}>Télécharger</Button>)}
      </td>
    </tr>
  )
}
