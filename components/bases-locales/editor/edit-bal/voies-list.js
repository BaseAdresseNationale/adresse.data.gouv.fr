import React from 'react'
import PropTypes from 'prop-types'

import VoieItem from './item/voie-item'
import {ItemContext} from '.'

class VoiesList extends React.Component {
  static propTypes = {
    commune: PropTypes.object.isRequired,
    voies: PropTypes.arrayOf(
      PropTypes.shape({
        idVoie: PropTypes.string.isRequired,
        nomVoie: PropTypes.string.isRequired
      })
    ).isRequired
  }

  render() {
    const {commune, voies} = this.props

    return (
      <div>
        {voies.map(voie => (
          <ItemContext.Consumer key={voie.idVoie}>
            {actions => (
              <VoieItem
                commune={commune}
                voie={voie}
                itemActions={actions}
              />
            )}
          </ItemContext.Consumer>
        ))}
      </div>
    )
  }
}

export default VoiesList
