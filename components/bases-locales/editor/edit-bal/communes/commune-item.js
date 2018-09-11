import React from 'react'
import PropTypes from 'prop-types'

import EditableItem from '../item/editable-item'
import CommuneForm from '../context/commune/commune-form'

class CommuneItem extends React.Component {
  state = {
    editing: false
  }

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

  toggleForm = () => {
    this.setState(state => {
      return {
        editing: !state.editing
      }
    })
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

  delete = async () => {
    const {commune, actions} = this.props
    let error

    try {
      await actions.deleteItem(commune)
    } catch (err) {
      error = err
    }

    this.setState({error})
  }

  cancel = async () => {
    const {commune, actions} = this.props
    let error

    try {
      await actions.cancelChange(commune)
    } catch (err) {
      error = err
    }

    this.setState({error})
  }

  render() {
    const {editing, error} = this.state
    const {commune, actions} = this.props
    const item = {
      id: commune.code,
      name: commune.nom,
      meta: commune.voies ? this.getVoies(commune) : 'Toponyme',
      status: this.getStatus(commune),
      handleClick: () => actions.select(commune.code)
    }

    return (
      <EditableItem item={item} toggleForm={this.toggleForm}>
        {editing && (
          <CommuneForm
            commune={commune}
            deleteCommune={this.delete}
            cancel={this.cancel}
            error={error}
          />
        )}
      </EditableItem>
    )
  }
}

export default CommuneItem
