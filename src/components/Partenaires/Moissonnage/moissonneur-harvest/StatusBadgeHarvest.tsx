import Badge from '@codegouvfr/react-dsfr/Badge'

import { HarvestStatus, UpdateStatusEnum } from '@/types/api-moissonneur-bal.types'
import Tooltip from '@/components/Tooltip'

type StatusBadgeHarvestProps = {
  status: HarvestStatus
  error?: string
  updateStatus: UpdateStatusEnum
  updateRejectionReason?: string
}

const StatusBadgeHarvest = ({
  status,
  error,
  updateStatus,
  updateRejectionReason,
}: StatusBadgeHarvestProps) => {
  if (status === HarvestStatus.ACTIVE) {
    return (
      <Badge severity="info" noIcon>
        En cours…
      </Badge>
    )
  }

  if (status === HarvestStatus.FAILED) {
    return (
      <Tooltip message={error}>
        <Badge severity="error" noIcon>
          Échec
        </Badge>
      </Tooltip>
    )
  }

  if (updateStatus === UpdateStatusEnum.UNCHANGED) {
    return (
      <Badge severity="info" noIcon>
        Aucun changement
      </Badge>
    )
  }

  if (updateStatus === UpdateStatusEnum.REJECTED) {
    return (
      <Tooltip message={updateRejectionReason}>
        <Badge severity="error" noIcon>
          Rejeté
        </Badge>
      </Tooltip>
    )
  }

  if (updateStatus === UpdateStatusEnum.UPDATED) {
    return (
      <Badge severity="success" noIcon>
        Mis à jour
      </Badge>
    )
  }

  return null
}

export default StatusBadgeHarvest
