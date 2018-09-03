import React from 'react'
import PropTypes from 'prop-types'

import CommunesList from '../communes/communes-list'

import CommuneContext from './commune-context'
import VoieContext from './voie-context'
import NumeroContext from './numero-context'

class AdaptContext extends React.Component {
  static propTypes = {
    selected: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['commune', 'voie', 'numero'])
  }

  static defaultProps = {
    type: null
  }

  render() {
    const {selected, type} = this.props

    switch (type) {
      case 'commune':
        return (
          <CommuneContext commune={selected} />
        )
      case 'voie':
        return (
          <VoieContext voie={selected} />
        )
      case 'numero':
        return (
          <NumeroContext numero={selected} />
        )
      default:
        return (
          <CommunesList communes={selected} />
        )
    }
  }
}

export default AdaptContext
