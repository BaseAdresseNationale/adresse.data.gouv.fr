import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../styles/theme'

import {getType} from '../../lib/bal/item'

import CreateFeatureMenu from './create-feature-menu'
import EditionMenu from './edition-menu'

class ContextMenu extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    voies: PropTypes.array,
    voie: PropTypes.object,
    numero: PropTypes.object,
    coordinates: PropTypes.array,
    layer: PropTypes.shape({
      layerX: PropTypes.number.isRequired,
      layerY: PropTypes.number.isRequired
    }).isRequired,
    actions: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired
  }

  static defaultProps = {
    item: null,
    voies: null,
    voie: null,
    numero: null,
    coordinates: null
  }

  render() {
    const {item, voies, voie, numero, coordinates, layer, actions, close} = this.props
    const itemType = item ? getType(item) : null

    return (
      <div className='context-menu'>
        {item ? (
          <EditionMenu
            type={itemType}
            item={item}
            numero={numero}
            actions={actions}
            close={close}
          />
        ) : (
          <CreateFeatureMenu
            voies={voies}
            voie={voie}
            coordinates={coordinates}
            actions={actions}
            close={close}
          />
        )}

        <style jsx>{`
          .context-menu {
            z-index: 999;
            position: absolute;
            top: ${layer.layerY}px;
            left: ${layer.layerX}px;
            padding: 0.5em;
            background: #fff;
            border: 1px solid ${theme.border};
            border-radius: 4px;
          }
          `}</style>
      </div>
    )
  }
}

export default ContextMenu
