import React from 'react'
import PropTypes from 'prop-types'

import CommuneItem from './commune-item'

class CommunesList extends React.Component {
  static propTypes = {
    communes: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  }

  render() {
    const {communes, actions} = this.props

    return (
      Object.keys(communes).map(commune => (
        <CommuneItem
          key={communes[commune].code}
          commune={communes[commune]}
          actions={actions}
        />
      ))
    )
  }
}

export default CommunesList
