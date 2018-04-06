import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import LoadingContent from '../../loading-content'

import Address from './address'

const AddressesMap = dynamic(import('./addresses-map'), {
  ssr: false,
  loading: () => (
    <LoadingContent centered>Chargement…</LoadingContent>
  )
})

function toGeoJson(data) {
  return {
    type: 'FeatureCollection',
    features: data.map(address => {
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

class Voie extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: null,
      geojson: props.data ? toGeoJson(props.data) : {}
    }
    this.handleSelect = this.handleSelect.bind(this)
  }

  handleSelect(feature) {
    const {data} = this.props
    this.setState({selected: data.filter(address => address.numero === feature.properties.numero)[0]})
  }

  render() {
    const {data} = this.props
    const {selected, geojson} = this.state

    if (data && data.length <= 0) {
      return <h1>Aucune adresse répertorié</h1>
    }

    return (
      <div className='container'>
        {selected && <Address address={selected} />}
        <div className='map'>
          <AddressesMap data={geojson} selectedAddress={selected} onSelect={this.handleSelect} />
        </div>
        <style jsx>{`
          .container {
            display: flex;
            flex-flow: wrap;
            flex-direction: row;
          }

          .map {
            width: 80%;
            height: 500px;
          }
        `}</style>
      </div>
    )
  }
}

Voie.propTypes = {
  data: PropTypes.array
}

Voie.defaultProps = {
  data: null
}

export default Voie
