import React from 'react'
import PropTypes from 'prop-types'

import Button from '../button'

import VoieMenu from './voie-menu'

class EditionMenu extends React.Component {
  static propTypes = {
    type: PropTypes.bool.isRequired,
    feature: PropTypes.object.isRequired,
    numero: PropTypes.shape({
      positions: PropTypes.array.isRequired
    }),
    actions: PropTypes.shape({
      deleteItem: PropTypes.func.isRequired
    }).isRequired,
    close: PropTypes.func.isRequired
  }

  static defaultProps = {
    numero: null
  }

  deleteItem = async () => {
    const {type, feature, actions, close} = this.props

    if (type === 'numero') {
      await actions.deleteItem(feature.properties)
    }

    close()
  }

  render() {
    const {type, feature, actions} = this.props

    return (
      <div>
        {type === 'voie' ? (
          <VoieMenu
            voie={feature.properties}
            actions={actions}
            close={close}
          />
        ) : (
          <Button
            color='red'
            onClick={this.deleteItem}
          >
          Supprimer
          </Button>
        )}
      </div>
    )
  }
}

export default EditionMenu
