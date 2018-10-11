import React from 'react'
import PropTypes from 'prop-types'

import Button from '../../../../../button'
import Notification from '../../../../../notification'

import SinglePositionMap from './single-position-map'

class PositionForm extends React.Component {
  static propTypes = {
    position: PropTypes.object,
    handlePosition: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    error: PropTypes.instanceOf(Error)
  }

  static defaultProps = {
    position: null,
    onSave: null,
    onCancel: null,
    error: null
  }

  handlePosition = position => {
    const {handlePosition} = this.props
    handlePosition(position)
  }

  render() {
    const {position, onSave, onCancel, error} = this.props

    return (
      <div>
        <div className='map'>
          <Notification type='info'>
            Sélectionnez le marqueur puis déplacez-le à la position souhaitée.
          </Notification>

          <SinglePositionMap
            coords={position.coords}
            handlePosition={this.handlePosition}
          />
        </div>

        {error && (
          <Notification type='error'>
            {error.message}
          </Notification>
        )}

        <div className='buttons'>
          {onCancel && (
            <Button
              size='small'
              onClick={onCancel}
            >
              Annuler les changements
            </Button>
          )}

          {onSave && (
            <Button
              size='small'
              onClick={onSave}
            >
              Enregistrer la nouvelle position
            </Button>
          )}
        </div>

        <style jsx>{`
          .buttons {
            display: flex;
            flex-flow: wrap;
            justify-content: space-between;
            align-items: center;
            margin: 1em;
          }
        `}</style>
      </div>
    )
  }
}

export default PositionForm
