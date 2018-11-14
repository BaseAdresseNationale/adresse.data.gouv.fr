import React from 'react'
import PropTypes from 'prop-types'

import getStatus from '../../../../../../lib/bal/item'

import Mapbox from '../../../../../mapbox'

import Head from '../head'
import AddressesCommuneMap from '../addresses-commune-map'

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
    }).isRequired
  }

  static defaultProps = {
    addresses: null,
    communeContour: null
  }

  render() {
    const {commune, addresses, communeContour, actions} = this.props
    const {voies} = commune
    const hasVoies = voies && Object.keys(voies).length > 0

    return (
      <div>
        <Head
          name={commune.nom}
          status={getStatus(commune)}
          parent='Communes'
          previous={() => actions.select(null)}
        />

        {addresses && addresses.features.length > 0 && (
          <Mapbox switchStyle>
            {map => (
              <AddressesCommuneMap
                map={map}
                data={addresses}
                bounds={communeContour}
                select={actions.select}
              />
            )}
          </Mapbox>
        )}

        {hasVoies ? (
          <VoiesList
            voies={voies}
            codeCommune={commune.code}
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
