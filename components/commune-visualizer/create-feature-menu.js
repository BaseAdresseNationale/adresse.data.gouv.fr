import React from 'react'
import PropTypes from 'prop-types'

import CreateAddressMenu from './create-address-menu'
import CreatePositionMenu from './create-position-menu'

class CreateFeatureMenu extends React.Component {
  static propTypes = {
    voies: PropTypes.array,
    voie: PropTypes.object,
    numero: PropTypes.object,
    coordinates: PropTypes.array.isRequired,
    actions: PropTypes.shape({
      addItem: PropTypes.func.isRequired
    }).isRequired,
    close: PropTypes.func.isRequired
  }

  static defaultProps = {
    voies: null,
    voie: null,
    numero: null
  }

  render() {
    const {numero, coordinates, actions, close} = this.props

    return (
      <>
        {numero ? (
          <CreatePositionMenu
            numero={numero}
            coordinates={coordinates}
            actions={actions}
            close={close}
          />
        ) : (
          <CreateAddressMenu {...this.props} />
        )}
      </>
    )
  }
}

export default CreateFeatureMenu
