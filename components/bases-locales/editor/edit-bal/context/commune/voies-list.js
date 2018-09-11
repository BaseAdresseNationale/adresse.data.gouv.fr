import React from 'react'
import PropTypes from 'prop-types'

import {FormContext} from '../..'

import VoieItem from './voie-item'

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
                voie={voies[voie]}
                codeCommune={codeCommune}
                actions={context.actions}
              />
            )}
          </FormContext.Consumer>
        ))}
      </div>
    )
  }
}

export default VoiesList
