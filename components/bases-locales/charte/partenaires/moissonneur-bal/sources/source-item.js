import PropTypes from 'prop-types'
import Badge from '@codegouvfr/react-dsfr/Badge'

import {formatDate} from '@/lib/date'
import Button from '@/components/button'

function MoissonneurSourceItem({title, enabled, _deleted, _updated, isSelected, onSelect}) {
  return (
    <tr>
      <td className='fr-col'>{title}</td>
      <td className='fr-col'>
        {_deleted ? (
          <Badge severity='error' style={{marginRight: 2, marginBottom: 2}}>
            Supprimé
          </Badge>
        ) : (enabled ? (
          <Badge severity='success' style={{marginRight: 2, marginBottom: 2}}>
            Activé
          </Badge>
        ) : (
          <Badge severity='error' style={{marginRight: 2, marginBottom: 2}}>
            Désactivé
          </Badge>
        ))}
      </td>
      <td className='fr-col'>
        {_updated && formatDate(_updated)}
      </td>
      <td className='fr-col fr-my-1v'>
        <Button disabled={isSelected} onClick={onSelect}>Selectionner</Button>
      </td>
    </tr>
  )
}

MoissonneurSourceItem.propTypes = {
  title: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
  _deleted: PropTypes.bool.isRequired,
  _updated: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
}

export default MoissonneurSourceItem
