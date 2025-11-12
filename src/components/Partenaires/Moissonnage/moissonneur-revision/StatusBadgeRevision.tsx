import { Badge } from '@codegouvfr/react-dsfr/Badge'

import { PublicationMoissoneurType, UpdateStatusEnum, RevisionStatusMoissoneurEnum } from '@/types/api-moissonneur-bal.types'
import Tooltip from '@/components/Tooltip'
import { Revision } from '@/types/api-depot.types'

type UpdateStatusBadgeProps = {
  updateStatus: UpdateStatusEnum
  updateRejectionReason?: string
  publicationMoissoneur: PublicationMoissoneurType
  revisionApiDepot?: Revision
}

const StatusBadgeRevision = ({
  updateStatus,
  updateRejectionReason,
  publicationMoissoneur,
  revisionApiDepot,
}: UpdateStatusBadgeProps) => {
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
    if (
      publicationMoissoneur?.status == RevisionStatusMoissoneurEnum.PROVIDED_BY_OTHER_CLIENT
    ) {
      return (
        <Badge severity="warning" noIcon>
          Publiée par un autre client
        </Badge>
      )
    }

    if (
      publicationMoissoneur?.status == RevisionStatusMoissoneurEnum.PROVIDED_BY_OTHER_SOURCE
    ) {
      return (
        <Badge severity="error" noIcon>
          Publiée par une autre source
        </Badge>
      )
    }

    if (
      publicationMoissoneur?.status === RevisionStatusMoissoneurEnum.PUBLISHED
    ) {
      if (
        revisionApiDepot && revisionApiDepot.id !== publicationMoissoneur.publishedRevisionId
      ) {
        return (
          <Badge severity="info" noIcon>
            Remplacée par {revisionApiDepot?.client?.nom}
          </Badge>
        )
      }
      return (
        <Badge severity="success" noIcon>
          Publiée
        </Badge>
      )
    }

    if (publicationMoissoneur?.status === RevisionStatusMoissoneurEnum.ERROR) {
      return (
        <Tooltip message={publicationMoissoneur?.errorMessage}>
          <Badge severity="error" noIcon>
            Erreur
          </Badge>
        </Tooltip>
      )
    }
  }
  return <Badge noIcon>Non publiée</Badge>
}

export default StatusBadgeRevision
