import React from 'react'
import PropTypes from 'prop-types'

import getStatus from '../../../../../../lib/bal/item'

import Head from '../head'

import VoiesList from './voies-list'
import EmptyVoiesList from './empty-voies-list'

class CommuneContext extends React.Component {
  static propTypes = {
    commune: PropTypes.shape({
      nom: PropTypes.string.isRequired,
      voies: PropTypes.object.isRequired
    }).isRequired,
    addresses: PropTypes.object,
    communeContour: PropTypes.object,
    actions: PropTypes.shape({
      addItem: PropTypes.func.isRequired,
      select: PropTypes.func.isRequired
    }).isRequired,
    children: PropTypes.node
  }

  static defaultProps = {
    addresses: null,
    communeContour: null,
    children: null
  }

  render() {
    const {commune, addresses, communeContour, actions, children} = this.props
    const {voies, nom, code} = commune
    const hasVoies = voies && Object.keys(voies).length > 0

    return (
      <div>
        <Head
          name={nom}
          status={getStatus(commune)}
          parent='Communes'
          previous={() => actions.select(null)}
        />

        {children}

        {hasVoies ? (
          <VoiesList
            voies={voies}
            codeCommune={code}
            bounds={communeContour || addresses}
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
