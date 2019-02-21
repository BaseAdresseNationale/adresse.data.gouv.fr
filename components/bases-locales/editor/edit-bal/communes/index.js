import React from 'react'
import PropTypes from 'prop-types'

import CommunesList from './communes-list'
import InitBAL from './init-bal'

class Communes extends React.Component {
  static propTypes = {
    communes: PropTypes.object,
    actions: PropTypes.object.isRequired
  }

  static defaultProps = {
    communes: null
  }

  render() {
    const {communes, actions} = this.props
    const hasCommune = communes && Object.keys(communes).length > 0

    return (
      <div>
        {hasCommune ? (
          <CommunesList communes={Object.values(communes)} actions={actions} />
        ) : (
          <InitBAL addCommune={actions.addItem} />
        )}
      </div>
    )
  }
}

export default Communes
