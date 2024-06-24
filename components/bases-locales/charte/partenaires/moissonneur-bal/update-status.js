import PropTypes from 'prop-types'

import Badge from '@codegouvfr/react-dsfr/Badge'
import Tooltip from '@/components/base-adresse-nationale/tooltip'

function UpdateStatusBadge({status, error}) {
  if (status === 'unchanged') {
    return <Badge severity='info' noIcon>Aucun changement</Badge>
  }

  if (status === 'rejected') {
    return (
      <Tooltip message={error} width='200px'>
        <Badge severity='error' noIcon>Rejeté</Badge>
      </Tooltip>
    )
  }

  if (status === 'updated') {
    return <Badge severity='success' noIcon>Mis à jour</Badge>
  }
}

UpdateStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  error: PropTypes.string,
}

export default UpdateStatusBadge
