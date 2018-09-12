import React from 'react'
import PropTypes from 'prop-types'

import VoieItem from './voie-item'

class VoiesList extends React.Component {
  static propTypes = {
    codeCommune: PropTypes.string.isRequired,
    voies: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  }

  render() {
    const {codeCommune, voies, actions} = this.props

    return (
      <div>
        {Object.keys(voies).map(voie => (
          <VoieItem
            key={voie}
            voie={voies[voie]}
            codeCommune={codeCommune}
            actions={actions}
          />
        ))}
      </div>
    )
  }
}

export default VoiesList
