import Tooltip from '@/components/Tooltip'
import { findCommuneName } from '@/utils/cog'
import { formatDate } from '@/utils/date'
import Badge from '@codegouvfr/react-dsfr/Badge'
import getConfig from 'next/config'
import UpdateStatusBadge from '../UpdateStatus'
import { getFileLink } from '@/lib/api-moissonneur-bal'
import Button from '@codegouvfr/react-dsfr/Button'
import { PublicationMoissoneurType, RevisionMoissoneurType } from '@/types/api-moissonneur-bal.types'

const { NEXT_PUBLIC_CLIENT_GUICHET_ADRESSE: CLIENT_GUICHET_ADRESSE } = getConfig().publicRuntimeConfig
const { NEXT_PUBLIC_CLIENT_MES_ADRESSE: CLIENT_MES_ADRESSE } = getConfig().publicRuntimeConfig
const { NEXT_PUBLIC_CLIENT_FORMULAIRE_PUBLICATION: CLIENT_FORMULAIRE_PUBLICATION } = getConfig().publicRuntimeConfig

const otherClients = [
  {
    id: CLIENT_GUICHET_ADRESSE,
    name: 'Guichet Adresse',
  },
  {
    id: CLIENT_MES_ADRESSE,
    name: 'Mes Adresses',
  },
  {
    id: CLIENT_FORMULAIRE_PUBLICATION,
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

export default function MoissonneurRevisionItem({ codeCommune, _created, nbRows, nbRowsWithErrors, updateStatus, updateRejectionReason, publication, fileId }: RevisionMoissoneurType) {
  return (
    <tr>
      <td className="fr-col fr-my-1v">
        <p>{findCommuneName(codeCommune)} ({codeCommune})</p>
      </td>
      <td className="fr-col fr-my-1v">
        <p>{formatDate(_created)}</p>
      </td>
      <td className="fr-col fr-my-1v">
        <p>{`${nbRows} / ${nbRowsWithErrors}`}</p>
      </td>
      <td className="fr-col fr-my-1v">
        <UpdateStatusBadge status={updateStatus} error={updateRejectionReason} />
      </td>
      <td className="fr-col fr-my-1v">
        {publication && <PublicationStatusBadge {...publication} />}
      </td>
      <td className="fr-col fr-my-1v">
        {fileId && <Button linkProps={{ href: getFileLink(fileId) }}>Télécharger</Button>}
      </td>
    </tr>
  )
}
