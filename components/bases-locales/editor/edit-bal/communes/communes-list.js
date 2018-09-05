import React from 'react'
import PropTypes from 'prop-types'

import CommuneItem from '../item/commune-item'

class CommunesList extends React.Component {
  static propTypes = {
    communes: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  }

  render() {
    const {communes, actions} = this.props

    return (
      <div>
        {Object.keys(communes).map(commune => (
          <CommuneItem
            key={communes[commune].code}
            commune={communes[commune]}
            actions={actions}
          />
        ))}
      </div>
    )
  }
}

export default CommunesList
