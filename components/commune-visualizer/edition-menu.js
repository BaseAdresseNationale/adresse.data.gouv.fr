import React from 'react'
import PropTypes from 'prop-types'

import Button from '../button'

import VoieMenu from './voie-menu'

class EditionMenu extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    item: PropTypes.object.isRequired,
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
    const {type, item, numero, actions, close} = this.props

    if (type === 'numero') {
      await actions.deleteItem(item)
    } else {
      const positions = [...numero.positions]
      positions.forEach((position, idx) => {
        if (position._id === item._id) {
          positions.splice(idx, 1)
        }
      })

      await actions.updateNumero(numero, {positions})
    }

    close()
  }

  render() {
    const {type, item, actions} = this.props

    return (
      <div>
        {type === 'voie' ? (
          <VoieMenu
            voie={item}
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
