import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import computeBbox from '@turf/bbox'

import {addressesToGeoJson} from '../../../lib/geojson'

import Mapbox from '../../mapbox'

import AddressesMap from '../../mapbox/addresses-map'

const MapContainer = ({voie, addresses, numero, onSelect}) => {
  const [bbox, setBbox] = useState(null)
  const [numeros, setNumeros] = useState(null)
  const [currentVoie, setCurrentVoie] = useState(null)

  const selectAddress = feature => {
    const numero = feature ? feature.properties.numero : null
    const suffixe = feature ? feature.properties.suffixe : null
    onSelect(numero, suffixe)
  }

  useEffect(() => {
    if (addresses && currentVoie !== voie.idVoie) {
      const numeros = addressesToGeoJson(addresses)
      setCurrentVoie(voie.idVoie)
      setNumeros(numeros)
      setBbox(computeBbox(numeros))
    }
  }, [addresses, currentVoie, voie])

  return (
    <div className='explore-map-container'>
      <Mapbox bbox={bbox} switchStyle>
        {({...mapboxProps}) => (
          <AddressesMap
            {...mapboxProps}
            voie={voie}
            numeros={numeros}
            numero={numero}
            onSelectNumero={selectAddress}
          />
        )}
      </Mapbox>

      <style jsx>{`
          .explore-map-container {
            height: 500px;
            border: 1px solid whitesmoke;
          }
        `}</style>
    </div>
  )
}

MapContainer.propTypes = {
  voie: PropTypes.object,
  addresses: PropTypes.array,
  numero: PropTypes.object,
  onSelect: PropTypes.func.isRequired
}

MapContainer.defaultProps = {
  voie: null,
  addresses: null,
  numero: null
}

export default MapContainer
