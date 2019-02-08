import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../styles/theme'

import {getType} from '../../lib/bal/item'

import CreateFeatureMenu from './create-feature-menu'
import VoieMenu from './voie-menu'

class ContextMenu extends React.Component {
  static propTypes = {
    feature: PropTypes.shape({
      properties: PropTypes.object.isRequired
    }),
    voies: PropTypes.array,
    voie: PropTypes.object,
    coordinates: PropTypes.array,
    layer: PropTypes.shape({
      layerX: PropTypes.number.isRequired,
      layerY: PropTypes.number.isRequired
    }).isRequired,
    actions: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired
  }

  static defaultProps = {
    feature: null,
    voies: null,
    voie: null,
    coordinates: null
  }

  render() {
    const {feature, voies, voie, coordinates, layer, actions, close} = this.props
    const featureType = feature ? getType(feature.properties) : null

    return (
      <div className='context-menu'>
        {feature ? (
          featureType === 'voie' && (
            <VoieMenu
              voie={feature.properties}
              actions={actions}
              close={close}
            />
          )) : (
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
