import React from 'react'
import PropTypes from 'prop-types'

import Item from '.'

const getVoies = commune => {
  const voiesCount = Object.keys(commune.voies).length

  switch (voiesCount) {
    case 0:
      return 'Aucune voie'
    case 1:
      return '1 voie'
    default:
      return `${voiesCount} voies`
  }
}

class CommuneItem extends React.Component {
  static propTypes = {
    commune: PropTypes.shape({
      nom: PropTypes.string.isRequired,
      voies: PropTypes.object.isRequired,
      deleted: PropTypes.bool
    }).isRequired,
    select: PropTypes.func.isRequired,
    deleteItem: PropTypes.func.isRequired,
    cancelChanges: PropTypes.func.isRequired
  }

  getActions = () => {
    const {commune, deleteItem, cancelChanges} = this.props

    if (commune.deleted) {
      return [{type: 'cancel', func: () => cancelChanges(commune)}]
    }

    return [{type: 'delete', func: () => deleteItem(commune)}]
  }

  render() {
    const {commune, select} = this.props
    const actionsAvailable = this.getActions()

    return (
      <Item
        name={commune.nom}
        childs={commune.voies ? getVoies(commune) : 'Toponyme'}
        status={commune.deleted ? 'deleted' : null}
        handleClick={() => select(commune)}
        actions={actionsAvailable}
      />
    )
  }
}

export default CommuneItem
