import React from 'react'
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
          sources: address.sources,
          destination: address.destination
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
    this.selectAddress = this.selectAddress.bind(this)
  }

  selectAddress(feature) {
    const {onSelect} = this.props
    onSelect({numero: feature.properties.numero})
  }

  render() {
    const {voie, selected, onSelect} = this.props
    const {geojson} = this.state

    return (
      <div className='container'>
        <div className='map'>
          <AddressesMap
            addresses={geojson}
            selectedAddress={selected}
            handleSelect={this.selectAddress} />
        </div>

        {selected &&
          <div className='selected-address'>
            <Address voie={voie} address={selected} onClose={onSelect} />
          </div>
        }

        <style jsx>{`
          .container {
            display: flex;
            flex-flow: wrap;
          }

          .map {
            height: 500px;
            min-height: 500px;
            width: ${selected ? '80%' : '100%'};
            border: 1px solid whitesmoke;
          }

          .selected-address {
            width: 20%;
            min-width: 200px;
            padding: 0 2em;
            box-shadow: 0 1px 4px ${theme.boxShadow};
          }

          @media (max-width: 900px) {
            .container {
              flex-direction: column;
            }

            .map {
              width: 100%;
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
  onSelect: PropTypes.func.isRequired
}

MapContainer.defaultProps = {
  addresses: null
}

export default MapContainer
