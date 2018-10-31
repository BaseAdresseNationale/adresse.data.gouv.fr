import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../styles/theme'

import Notification from '../../../../notification'

import SearchCommunes from '../search-communes'

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
        <h2>Création d’une Base Adresse Locale vierge</h2>

        <div className='init-bal'>
          <div>
            <h4>Ajoutez une première commune à votre Base Adresse Locale</h4>
            <Notification type='info'>
              Recherchez une commune et sélectionnez la afin de l’ajouter.
            </Notification>
          </div>

          <SearchCommunes handleSelect={this.handleSubmit} />
        </div>

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
