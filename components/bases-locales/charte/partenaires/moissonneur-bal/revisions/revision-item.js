import PropTypes from 'prop-types'
import getConfig from 'next/config'

import UpdateStatusBadge from '../update-status'
import ButtonLink from '@/components/button-link'
import {getFileLink} from '@/lib/moissonneur-bal'
import Tooltip from '@/components/base-adresse-nationale/tooltip'
import Badge from '@codegouvfr/react-dsfr/Badge'
import {formatDate} from '@/lib/date'
import {findCommuneName} from '@/lib/cog'

const {NEXT_PUBLIC_CLIENT_GUICHET_ADRESSE: CLIENT_GUICHET_ADRESSE} = getConfig().publicRuntimeConfig
const {NEXT_PUBLIC_CLIENT_MES_ADRESSE: CLIENT_MES_ADRESSE} = getConfig().publicRuntimeConfig
const {NEXT_PUBLIC_CLIENT_FORMULAIRE_PUBLICATION: CLIENT_FORMULAIRE_PUBLICATION} = getConfig().publicRuntimeConfig

const otherClients = [
  {
    id: CLIENT_GUICHET_ADRESSE,
    name: 'Guichet Adresse'
  },
  {
    id: CLIENT_MES_ADRESSE,
    name: 'Mes Adresses'
  },
  {
    id: CLIENT_FORMULAIRE_PUBLICATION,
    name: 'Formulaire Publication'
  }
]

function PublicationStatusBadge({status, currentClientId, errorMessage}) {
  if (status === 'provided-by-other-client') {
    const client = otherClients.find(({id}) => id === currentClientId)
    return (
      <Tooltip message={client?.name || 'Client api depot'}>
        <Badge severity='warning' noIcon>Publiée par un autre client</Badge>
      </Tooltip>
    )
  }

  if (status === 'provided-by-other-source') {
    return <Badge severity='error' noIcon>Publiée par un autre Moissonneur</Badge>
  }

  if (status === 'published') {
    return <Badge severity='success' noIcon>Publiée</Badge>
  }

  if (status === 'error') {
    return (
      <Tooltip message={errorMessage}>
        <Badge severity='error' noIcon>Erreur</Badge>
      </Tooltip>
    )
  }

  return (
    <Badge noIcon>Non publiée</Badge>
  )
}

PublicationStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  currentClientId: PropTypes.string,
  errorMessage: PropTypes.string,
}

function MoissonneurRevisionItem({codeCommune, createdAt, validation, updateStatus, updateRejectionReason, publication, fileId}) {
  return (
    <tr>
      <td className='fr-col fr-my-1v'>
        <p>{findCommuneName(codeCommune)} ({codeCommune})</p>
      </td>
      <td className='fr-col fr-my-1v'>
        <p>{formatDate(createdAt)}</p>
      </td>
      <td className='fr-col fr-my-1v'>
        <p>{`${validation.nbRows} / ${validation.nbRowsWithErrors}`}</p>
      </td>
      <td className='fr-col fr-my-1v'>
        <UpdateStatusBadge status={updateStatus} error={updateRejectionReason} />
      </td>
      <td className='fr-col fr-my-1v'>
        {publication && <PublicationStatusBadge {...publication} />}
      </td>
      <td className='fr-col fr-my-1v'>
        {fileId && <ButtonLink href={getFileLink(fileId)} isExternal>Télécharger</ButtonLink>}
      </td>
    </tr>
  )
}

MoissonneurRevisionItem.propTypes = {
  codeCommune: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  validation: PropTypes.object.isRequired,
  updateStatus: PropTypes.string.isRequired,
  updateRejectionReason: PropTypes.string,
  publication: PropTypes.object.isRequired,
  fileId: PropTypes.string.isRequired,
}

export default MoissonneurRevisionItem
