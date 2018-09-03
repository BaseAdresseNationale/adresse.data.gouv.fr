import React from 'react'
import PropTypes from 'prop-types'

import CommuneItem from '../item/commune-item'
import {FormContext} from '..'

class CommunesList extends React.Component {
  static propTypes = {
    communes: PropTypes.object.isRequired
  }

  render() {
    const {communes} = this.props

    return (
      <div>
        {Object.keys(communes).map(commune => (
          <FormContext.Consumer key={communes[commune].code}>
            {context => (
              <CommuneItem
                commune={communes[commune]}
                {...context}
              />
            )}
          </FormContext.Consumer>
        ))}
      </div>
    )
  }
}

export default CommunesList
