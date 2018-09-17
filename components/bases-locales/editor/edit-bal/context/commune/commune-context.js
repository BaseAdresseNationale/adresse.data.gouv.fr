import React from 'react'
import PropTypes from 'prop-types'

import Head from '../head'

import VoiesList from './voies-list'
import EmptyVoiesList from './empty-voies-list'

class CommuneContext extends React.Component {
  static propTypes = {
    commune: PropTypes.shape({
      nom: PropTypes.string.isRequired,
      voies: PropTypes.object.isRequired
    }).isRequired,
    actions: PropTypes.shape({
      addItem: PropTypes.func.isRequired,
      select: PropTypes.func.isRequired
    }).isRequired
  }

  render() {
    const {commune, actions} = this.props
    const {voies} = commune
    const hasVoies = voies && Object.keys(voies).length > 0

    return (
      <div>
        <Head
          name={commune.nom}
          parent='Communes'
          previous={() => actions.select(null)}
        />

        {hasVoies ? (
          <VoiesList
            voies={voies}
            codeCommune={commune.code}
            actions={actions}
          />
        ) : (
          <EmptyVoiesList addVoie={actions.addItem} />
        ) }
      </div>
    )
  }
}

export default CommuneContext
