import React from 'react'
import PropTypes from 'prop-types'

import CommuneContext from './commune-context'
import VoieContext from './voie-context'
import NumeroContext from './numero-context'

class AdaptContext extends React.Component {
  static propTypes = {
    context: PropTypes.shape({
      commune: PropTypes.object,
      voie: PropTypes.object
    }).isRequired,
    type: PropTypes.oneOf(['commune', 'voie', 'numero']).isRequired,
    item: PropTypes.object.isRequired
  }

  render() {
    const {context, type, item} = this.props
    const {commune, voie} = context

    switch (type) {
      case 'commune':
        return (
          <CommuneContext commune={item} />
        )
      case 'voie':
        return (
          <VoieContext commune={commune} voie={item} />
        )
      default:
        return (
          <NumeroContext
            commune={commune}
            voie={voie}
            numero={item}
          />
        )
    }
  }
}

export default AdaptContext
