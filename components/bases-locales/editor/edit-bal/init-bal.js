import React from 'react'
import PropTypes from 'prop-types'

import SearchCommunes from '../../init-base/search-communes'

class InitBAL extends React.Component {
  static propTypes = {
    addCommune: PropTypes.func.isRequired
  }

  handleSubmit = async commune => {
    const {addCommune} = this.props

    await addCommune(commune)
  }

  render() {
    return (
      <div>
        <h2>Ajoutez votre première commune</h2>
        <p>Recherchez une commune grâce au champ text et sélectionnez la afin de l’ajouter à votre fichier BAL.</p>

        <SearchCommunes handleSelect={this.handleSubmit} />
      </div>
    )
  }
}

export default InitBAL
