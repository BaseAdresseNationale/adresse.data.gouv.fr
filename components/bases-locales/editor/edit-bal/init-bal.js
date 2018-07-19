import React from 'react'
import PropTypes from 'prop-types'

import AddCommunes from './communes/add-communes'

class InitBal extends React.Component {
  state = {}

  static propTypes = {
    addCommunes: PropTypes.func.isRequired
  }

  render() {
    const {addCommunes} = this.props

    return (
      <div>
        <h2>Ajouter les communes</h2>
        <AddCommunes addedCommunes={[]} onSubmit={addCommunes} />
      </div>
    )
  }
}

export default InitBal
