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
  return {
    type: 'FeatureCollection',
    features: addresses.map(address => {
      return {
        type: 'Feature',
        geometry: {
          type: address.positions[0].type,
          coordinates: address.positions[0].coordinates
        },
        properties: {
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
      selected: null,
      geojson: props.addresses ? toGeoJson(props.addresses) : {}
    }
    this.handleSelect = this.handleSelect.bind(this)
  }

  handleSelect(feature) {
    const {addresses} = this.props
    this.setState({selected: addresses.filter(address => address.numero === feature.properties.numero)[0]})
  }

  render() {
    const {addresses} = this.props
    const {selected, geojson} = this.state

    if (addresses && addresses.length <= 0) {
      return <h1>Aucune adresse répertorié</h1>
    }

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
            <Address address={selected} />
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
          }

          .selected-address {
            width: 20%;
            padding: 0 2em;
            box-shadow: 0 1px 4px ${theme.boxShadow};
          }
        `}</style>
      </div>
    )
  }
}

MapContainer.propTypes = {
  addresses: PropTypes.array
}

MapContainer.defaultProps = {
  addresses: null
}

export default MapContainer
