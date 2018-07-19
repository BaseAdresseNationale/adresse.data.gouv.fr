import React from 'react'
import PropTypes from 'prop-types'

import CommuneItem from '../item/commune-item'

class CommunesList extends React.Component {
  static propTypes = {
    communes: PropTypes.arrayOf(
      PropTypes.shape({
        code: PropTypes.string.isRequired
      })
    ).isRequired,
    itemActions: PropTypes.object.isRequired
  }

  render() {
    const {communes, itemActions} = this.props

    return (
      <div>
        {communes.map(commune => (
          <CommuneItem
            key={commune.code}
            commune={commune}
            itemActions={itemActions}
          />
        ))}
      </div>
    )
  }
}

export default CommunesList
