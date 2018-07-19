import React from 'react'
import PropTypes from 'prop-types'

import Item from '.'

const getStatus = item => {
  let status = null

  if (item.deleted) {
    status = 'deleted'
  } else if (item.created) {
    status = 'created'
  } else if (item.edited) {
    status = 'edited'
  }

  return status
}

const getVoies = commune => {
  switch (commune.voies.length) {
    case 0:
      return 'Aucune voie'
    case 1:
      return '1 voie'
    default:
      return `${commune.voies.length} voies`
  }
}

class CommuneItem extends React.Component {
  static propTypes = {
    commune: PropTypes.shape({
      voies: PropTypes.array.isRequired
    }).isRequired,
    itemActions: PropTypes.shape({
      changeContext: PropTypes.func.isRequired,
      deleteItem: PropTypes.func.isRequired,
      cancelChanges: PropTypes.func.isRequired
    }).isRequired
  }

  getActions = () => {
    const {commune, itemActions} = this.props
    const {cancelChanges, deleteItem} = itemActions

    if (commune.deleted) {
      return [{type: 'cancel', func: () => cancelChanges(commune)}]
    }

    return [{type: 'delete', func: () => deleteItem(commune)}]
  }

  render() {
    const {commune, itemActions} = this.props
    const {changeContext} = itemActions
    const actions = this.getActions()

    return (
      <Item
        name={commune.nom}
        childs={commune.voies ? getVoies(commune) : 'Toponyme'}
        status={getStatus(commune)}
        handleClick={() => changeContext(commune)}
        actions={actions}
      />
    )
  }
}

export default CommuneItem
