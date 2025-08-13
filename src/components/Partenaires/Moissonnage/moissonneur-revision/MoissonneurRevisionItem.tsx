import Tooltip from '@/components/Tooltip'
import { findCommuneName } from '@/utils/cog'
import { formatDate } from '@/utils/date'
import Badge from '@codegouvfr/react-dsfr/Badge'
import UpdateStatusBadge from '../../UpdateStatus'
import { getFileLink } from '@/lib/api-moissonneur-bal'
import Button from '@codegouvfr/react-dsfr/Button'
import { PublicationMoissoneurType, RevisionMoissoneurType, RevisionStatusMoissoneurEnum } from '@/types/api-moissonneur-bal.types'
import { env } from 'next-runtime-env'
import { Revision } from '@/types/api-depot.types'
import { useEffect, useState } from 'react'
import { getCurrentRevision } from '@/lib/api-depot'

const otherClients = [
  {
    id: env('NEXT_PUBLIC_CLIENT_GUICHET_ADRESSE'),
    name: 'Guichet Adresse',
  },
  {
    id: env('NEXT_PUBLIC_CLIENT_MES_ADRESSE'),
    name: 'Mes Adresses',
  },
  {
    id: env('NEXT_PUBLIC_CLIENT_FORMULAIRE_PUBLICATION'),
    name: 'Formulaire Publication',
  },
]

export interface RevisionPublicationProps {
  publicationMoissoneur: PublicationMoissoneurType
  revisionApiDepot?: Revision
}

export const PublicationStatusBadge = ({
  publicationMoissoneur,
  revisionApiDepot,
}: RevisionPublicationProps) => {
  if (
    publicationMoissoneur?.status === RevisionStatusMoissoneurEnum.PROVIDED_BY_OTHER_CLIENT
  ) {
    return (
      <Tooltip message={publicationMoissoneur?.currentClientId || 'inconnue'}>
        <Badge severity="warning" noIcon>
          Publiée par un autre client
        </Badge>
      </Tooltip>
    )
  }

  if (
    publicationMoissoneur?.status === RevisionStatusMoissoneurEnum.PROVIDED_BY_OTHER_SOURCE
  ) {
    return (
      <Tooltip message={publicationMoissoneur?.currentSourceId || 'inconnue'}>
        <Badge severity="error" noIcon>
          Publiée par une autre source
        </Badge>
      </Tooltip>
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
          Remplacée par {revisionApiDepot.client.nom}
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

  return <Badge noIcon>Non publiée</Badge>
}

export default function MoissonneurRevisionItem({ codeCommune, createdAt, validation, updateStatus, updateRejectionReason, publication, fileId }: RevisionMoissoneurType) {
  const [revision, setRevision] = useState<Revision | undefined>(undefined)

  useEffect(() => {
    const fetchRevision = async () => {
      if (codeCommune) {
        const results = await getCurrentRevision(codeCommune)
        setRevision(results)
      }
    }

    fetchRevision()
  }, [codeCommune])

  return (
    <tr>
      <td className="fr-col fr-my-1v">
        <p>{findCommuneName(codeCommune)} ({codeCommune})</p>
      </td>
      <td className="fr-col fr-my-1v">
        <p>{formatDate(createdAt)}</p>
      </td>
      <td className="fr-col fr-my-1v">
        <p>{`${validation.nbRows} / ${validation.nbRowsWithErrors}`}</p>
      </td>
      <td className="fr-col fr-my-1v" style={{ textAlign: 'center' }}>
        <UpdateStatusBadge status={updateStatus} error={updateRejectionReason} />
      </td>
      <td className="fr-col fr-my-1v" style={{ textAlign: 'center' }}>
        {publication && <PublicationStatusBadge publicationMoissoneur={publication} revisionApiDepot={revision} />}
      </td>
      <td className="fr-col fr-my-1v">
        {fileId && <Button linkProps={{ href: getFileLink(fileId) }}>Télécharger</Button>}
      </td>
    </tr>
  )
}
