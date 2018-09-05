import React from 'react'
import PropTypes from 'prop-types'

import VoieItem from './item/voie-item'
import {FormContext} from '.'

class VoiesList extends React.Component {
  static propTypes = {
    codeCommune: PropTypes.string.isRequired,
    voies: PropTypes.object.isRequired
  }

  render() {
    const {codeCommune, voies} = this.props

    return (
      <div>
        {Object.keys(voies).map(voie => (
          <FormContext.Consumer key={voie}>
            {context => (
              <VoieItem
                key={voie.codeVoie}
                voie={voies[voie]}
                codeCommune={codeCommune}
                actions={context.actions}
                error={context.error}
              />
            )}

          </FormContext.Consumer>
        ))}
      </div>
    )
  }
}

export default VoiesList
