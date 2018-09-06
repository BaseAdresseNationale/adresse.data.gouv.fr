import React from 'react'
import PropTypes from 'prop-types'

import Button from '../../../../button'

import EditableItem from './editable-item'

class CommuneItem extends React.Component {
  static propTypes = {
    commune: PropTypes.shape({
      nom: PropTypes.string.isRequired,
      voies: PropTypes.object.isRequired,
      deleted: PropTypes.bool
    }).isRequired,
    actions: PropTypes.shape({
      select: PropTypes.func.isRequired,
      deleteItem: PropTypes.func.isRequired,
      cancelChange: PropTypes.func.isRequired
    }).isRequired
  }

  getVoies = () => {
    const {commune} = this.props
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

  getStatus = () => {
    const {commune} = this.props
    let status

    if (commune.created) {
      status = 'created'
    }

    if (commune.deleted) {
      status = 'deleted'
    }

    return status
  }

  delete = () => {
    const {commune, actions} = this.props
    actions.deleteItem(commune)
  }

  cancel = () => {
    const {commune, actions} = this.props
    actions.cancelChange(commune)
  }

  render() {
    const {commune, actions} = this.props
    const item = {
      id: commune.code,
      name: commune.nom,
      meta: commune.voies ? this.getVoies(commune) : 'Toponyme',
      status: this.getStatus(commune),
      handleClick: () => actions.select(commune.code)
    }

    return (
      <EditableItem item={item}>
        <div className='form'>
          {commune.deleted ? (
            <Button onClick={this.cancel}>Annuler la suppression</Button>
          ) : (
            <Button color='red' onClick={this.delete}>Supprimer la commune</Button>
          )}
        </div>

        <style jsx>{`
          .form {
            display: flex;
            justify-content: center;
          }
        `}</style>
      </EditableItem>
    )
  }
}

export default CommuneItem
