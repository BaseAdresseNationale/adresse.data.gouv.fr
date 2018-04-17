import React from 'react'
import Router, {withRouter} from 'next/router'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import theme from '../../../styles/theme'

import LoadingContent from '../../loading-content'

import Address from './address'

const AddressesMap = dynamic(import('./addresses-map'), {
  ssr: false,
  loading: () => (
    <LoadingContent loading centered>
      Chargement…
    </LoadingContent>
  )
})

function toGeoJson(addresses) {
  const addrs = addresses.filter(address => address.position)

  return {
    type: 'FeatureCollection',
    features: addrs.map(address => {
      return {
        type: 'Feature',
        geometry: {
          type: address.position.type,
          coordinates: address.position.coordinates
        },
        properties: {
          id: address.id,
          idVoie: address.idVoie,
          numero: address.numero,
          sources: address.sources
        }
      }
    }
  )}
}

class MapContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      geojson: props.addresses ? toGeoJson(props.addresses) : {}
    }
    this.handleSelect = this.handleSelect.bind(this)
  }

  handleSelect(feature) {
    const {router} = this.props
    const {codeCommune, codeVoie} = router.query
    const addressNb = feature ? feature.properties.numero : null

    Router.push(
      `/explore/commune/voies?codeCommune=${codeCommune}&codeVoie=${codeVoie}${addressNb ? `&numero=${addressNb}` : ''}`,
      `/explore/commune/${codeCommune}/voies/${codeVoie}${addressNb ? `/${addressNb}` : ''}`
    )
  }

  render() {
    const {voie, selected} = this.props
    const {geojson} = this.state

    return (
      <div className='container'>
        <div className='map'>
          <AddressesMap
            addresses={geojson}
            selectedAddress={selected}
            onSelect={this.handleSelect} />
        </div>

        {selected &&
          <div className='selected-address'>
            <Address voie={voie} address={selected} onClose={this.handleSelect} />
          </div>
        }

        <style jsx>{`
          .container {
            display: flex;
            flex-flow: wrap;
          }

          .map {
            height: 500px;
            width: ${selected ? '80%' : '100%'};
            border: 1px solid whitesmoke;
          }

          .selected-address {
            width: 20%;
            padding: 0 2em;
            box-shadow: 0 1px 4px ${theme.boxShadow};
          }

          @media (max-width: 749px) {
            .map {
              width: 100%;
              height: 500px;
              border: 1px solid whitesmoke;
            }

            .selected-address {
              width: 100%;
              padding: 0 2em;
              box-shadow: 0 1px 4px ${theme.boxShadow};
            }
          }
        `}</style>
      </div>
    )
  }
}

MapContainer.propTypes = {
  voie: PropTypes.object,
  addresses: PropTypes.array,
  selected: PropTypes.object,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired
  }).isRequired
}

MapContainer.defaultProps = {
  addresses: null
}

export default (withRouter(MapContainer))
