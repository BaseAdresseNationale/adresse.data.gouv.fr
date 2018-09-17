import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../styles/theme'

import SearchCommunes from '../../../init-base/search-communes'

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
      <div className='init-bal'>
        <div>
          <h4>Aucune commune</h4>
          <p>Recherchez une commune et sélectionnez la afin de l’ajouter.</p>
        </div>

        <SearchCommunes handleSelect={this.handleSubmit} />

        <style jsx>{`
          .init-bal {
            display: flex;
            flex-direction: column;
            border: 2px dashed ${theme.border};
            padding: 1em;
          }
        `}</style>
      </div>
    )
  }
}

export default InitBAL
