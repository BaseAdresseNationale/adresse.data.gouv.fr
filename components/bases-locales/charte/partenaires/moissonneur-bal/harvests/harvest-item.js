import PropTypes from 'prop-types'
import Badge from '@codegouvfr/react-dsfr/Badge'

import Tooltip from '@/components/base-adresse-nationale/tooltip'
import UpdateStatusBadge from '../update-status'
import ButtonLink from '@/components/button-link'
import {getFileLink} from '@/lib/moissonneur-bal'
import {formatDate} from '@/lib/date'

function StatusBadge({status, error}) {
  if (status === 'active') {
    return <Badge severity='info' noIcon>En cours…</Badge>
  }

  if (status === 'failed') {
    return (
      <Tooltip message={error}>
        <Badge severity='error' noIcon>Échec</Badge>
      </Tooltip>
    )
  }

  if (status === 'completed') {
    return <Badge severity='success' noIcon>Terminé</Badge>
  }
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  error: PropTypes.string,
}

function MoissonneurHarvestItem({startedAt, status, error, updateStatus, updateRejectionReason, fileId}) {
  return (
    <tr>
      <td className='fr-col fr-my-1v'>
        <p>{formatDate(startedAt)}</p>
      </td>
      <td className='fr-col fr-my-1v'>
        <StatusBadge status={status} error={error} />
      </td>
      <td className='fr-col fr-my-1v'>
        {updateStatus && <UpdateStatusBadge status={updateStatus} error={updateRejectionReason} />}
      </td>
      <td className='fr-col fr-my-1v'>
        {fileId && (
          <ButtonLink href={getFileLink(fileId)} isExternal>Télécharger</ButtonLink>)}
      </td>
    </tr>
  )
}

MoissonneurHarvestItem.propTypes = {
  startedAt: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  error: PropTypes.string,
  updateStatus: PropTypes.string,
  updateRejectionReason: PropTypes.string,
  fileId: PropTypes.string,
}

export default MoissonneurHarvestItem
