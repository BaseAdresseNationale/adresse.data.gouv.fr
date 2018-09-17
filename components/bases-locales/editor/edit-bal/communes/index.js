import React from 'react'
import PropTypes from 'prop-types'

import Head from '../context/head'

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
        <Head
          name='Communes'
          parent={null}
          toggleForm={this.toggleForm}
        />

        {hasCommune ? (
          <CommunesList communes={communes} actions={actions} />
        ) : (
          <InitBAL addCommune={actions.addItem} />
        )}
      </div>
    )
  }
}

export default Communes
