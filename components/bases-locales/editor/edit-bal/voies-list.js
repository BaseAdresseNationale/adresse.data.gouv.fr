import React from 'react'
import PropTypes from 'prop-types'

import VoieItem from './item/voie-item'
import {FormContext} from '.'

class VoiesList extends React.Component {
  static propTypes = {
    voies: PropTypes.object.isRequired
  }

  render() {
    const {voies} = this.props

    return (
      <div>
        {Object.keys(voies).map(voie => (
          <FormContext.Consumer key={voies[voie].idVoie}>
            {context => (
              <VoieItem
                voie={voies[voie]}
                {...context}
              />
            )}
          </FormContext.Consumer>
        ))}
      </div>
    )
  }
}

export default VoiesList
