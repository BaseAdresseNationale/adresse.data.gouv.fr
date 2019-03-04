import React from 'react'
import PropTypes from 'prop-types'

import FaTrash from 'react-icons/lib/fa/trash'
import FaClose from 'react-icons/lib/fa/close'

import {getStatus} from '../../../../../../lib/bal/item'

import Button from '../../../../../button'
import Notification from '../../../../../notification'

import Item from '../item'

class CommuneItem extends React.Component {
  state = {
    error: null
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
        return 'Ajouter une voie ➕'
      case 1:
        return '1 voie'
      default:
        return `${voiesCount} voies`
    }
  }

  delete = async () => {
    const {commune, actions} = this.props
    await actions.deleteItem(commune)
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
    const {error} = this.state
    const {commune, actions} = this.props
    const item = {
      id: commune.code,
      name: commune.nom,
      meta: commune.voies ? this.getVoies(commune) : 'Toponyme',
      status: getStatus(commune),
      handleClick: () => actions.select(commune.code)
    }

    return (
      <div>
        <div className='editable-item'>
          <div className='item'>
            <Item {...item} />
          </div>

          <div className='edit-button'>
            {commune.deleted ? (
              <Button size='small' onClick={this.cancel}>
                <FaClose />
              </Button>
            ) : (
              <Button size='small' color='red' onClick={this.delete}>
                <FaTrash />
              </Button>
            )}
          </div>
        </div>

        {error && (
          <Notification type='error'>
            {error.message}
          </Notification>
        )}

        <style jsx>{`
          .editable-item {
            display: flex;
            align-items: center;
          }

          .item {
            flex: 1;
          }

          .edit-button {
            margin: 0.5em;
          }
        `}</style>
      </div>
    )
  }
}

export default CommuneItem
