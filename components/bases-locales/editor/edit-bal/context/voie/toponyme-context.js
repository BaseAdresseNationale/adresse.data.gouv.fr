import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../../styles/theme'

import Button from '../../../../../button'

import PositionForm from './position-form'

class ToponymeContext extends React.Component {
  state = {
    newPosition: null,
    error: null
  }

  static propTypes = {
    voie: PropTypes.shape({
      position: PropTypes.object.isRequired,
      modified: PropTypes.object
    }).isRequired,
    actions: PropTypes.shape({
      deleteItem: PropTypes.func.isRequired,
      repositionVoie: PropTypes.func.isRequired,
      select: PropTypes.func.isRequired
    }).isRequired
  }

  delete = async () => {
    const {voie, actions} = this.props
    await actions.deleteItem(voie, true)
  }

  cancel = async () => {
    const {voie, actions} = this.props
    await actions.cancelChange(voie)
    this.setState({newPosition: null})
  }

  handlePosition = position => {
    this.setState({newPosition: position})
  }

  edit = async () => {
    const {newPosition} = this.state
    const {voie, actions} = this.props

    try {
      await actions.repositionVoie(voie, newPosition)
      this.setState({newPosition: null})
    } catch (error) {
      this.setState({error})
    }
  }

  render() {
    const {newPosition, error} = this.state
    const {voie} = this.props
    const modifiedPos = voie.modified ? voie.modified.position : null

    return (
      <div>
        <div className='shadow-box'>
          <PositionForm
            position={newPosition || modifiedPos || voie.position}
            error={error}
            handlePosition={this.handlePosition}
            onSave={newPosition ? this.edit : null}
            onCancel={newPosition ? this.cancelChange : null}
          />
        </div>

        <div className='buttons'>
          {(voie.edited || voie.deleted) && (
            <Button onClick={this.cancel}>
              Annuler les changements
            </Button>
          )}

          {!voie.deleted && (
            <Button color='red' onClick={this.delete}>
              Supprimer le toponyme
            </Button>
          )}
        </div>

        <style jsx>{`
          .shadow-box {
            border: 1px solid ${theme.border};
            box-shadow: 0 1px 4px 0 ${theme.boxShadow};
            padding: 1em;
          }

          .buttons {
            display: flex;
            flex-flow: wrap;
            margin: 1em 0;
          }
        `}</style>
      </div>
    )
  }
}

export default ToponymeContext
