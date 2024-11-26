import Tooltip from '@/components/Tooltip'
import { findCommuneName } from '@/utils/cog'
import { formatDate } from '@/utils/date'
import Badge from '@codegouvfr/react-dsfr/Badge'
import UpdateStatusBadge from '../UpdateStatus'
import { getFileLink } from '@/lib/api-moissonneur-bal'
import Button from '@codegouvfr/react-dsfr/Button'
import { PublicationMoissoneurType, RevisionMoissoneurType } from '@/types/api-moissonneur-bal.types'
import { env } from 'next-runtime-env'

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

function PublicationStatusBadge({ status, currentClientId, errorMessage }: PublicationMoissoneurType) {
  if (status === 'provided-by-other-client') {
    const client = otherClients.find(({ id }) => id === currentClientId)
    return (
      <Tooltip message={client?.name || 'Client api depot'}>
        <Badge severity="warning" noIcon>Publiée par un autre client</Badge>
      </Tooltip>
    )
  }

  if (status === 'provided-by-other-source') {
    return <Badge severity="error" noIcon>Publiée par un autre Moissonneur</Badge>
  }

  if (status === 'published') {
    return <Badge severity="success" noIcon>Publiée</Badge>
  }

  if (status === 'error') {
    return (
      <Tooltip message={errorMessage}>
        <Badge severity="error" noIcon>Erreur</Badge>
      </Tooltip>
    )
  }

  return (
    <Badge noIcon>Non publiée</Badge>
  )
}

export default function MoissonneurRevisionItem({ codeCommune, createdAt, validation, updateStatus, updateRejectionReason, publication, fileId }: RevisionMoissoneurType) {
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
        {publication && <PublicationStatusBadge {...publication} />}
      </td>
      <td className="fr-col fr-my-1v">
        {fileId && <Button linkProps={{ href: getFileLink(fileId) }}>Télécharger</Button>}
      </td>
    </tr>
  )
}
