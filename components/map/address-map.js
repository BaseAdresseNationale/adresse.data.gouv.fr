/* eslint react/no-danger: off */
import React, {useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'

import theme from '../../styles/theme'

import Loader from '../loader'

const popupHTML = address => {
  const {id, context, label, name, postcode, citycode, type, city} = address.properties
  const types = {
    locality: 'Lieu-dit',
    street: 'Voie',
    housenumber: 'Numéro'
  }

  return (`
      <div>
        <h3>${types[type]}</h3>
        <p>
          <div>${name}</div>
          <div>${postcode} ${city}</div>
          <div>Code INSEE : ${citycode}</div>
        </p>
        <div>Contexte : ${context}</div>
        <div>Label : ${label}</div>
        <div>ID : ${id}</div>
      </div>
      `)
}

const AddressMap = ({map, marker, popup, data, loading, center, zoom, mapUpdate, setMarkerCoordinates}) => {
  const onDragEnd = useCallback(() => {
    const {lng, lat} = map.getCenter()
    const zoom = map.getZoom()

    mapUpdate([lng, lat], zoom, true)
  })

  const onZoom = useCallback(() => {
    const {lng, lat} = map.getCenter()
    const zoom = map.getZoom()

    mapUpdate([lng, lat], zoom, false)
  })

  const onLoad = useCallback(() => {
    map.on('dragend', onDragEnd)
    map.on('zoom', onZoom)
  })

  map.once('load', onLoad)

  useEffect(() => {
    if (data) {
      setMarkerCoordinates(data.geometry.coordinates)
      popup.setHTML(popupHTML(data))
    } else {
      setMarkerCoordinates(null)
    }
  }, [data, marker, popup])

  useEffect(() => {
    if (center) {
      map.setCenter(center)
    }
  }, [center])

  useEffect(() => {
    if (zoom) {
      map.setZoom(zoom)
    }
  }, [zoom])

  return (
    <div>
      {loading ?
        <div className='centered'><Loader /></div> :
        <div className='map-center centered' />
      }

      <style jsx>{`
        .centered {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .map-center {
          z-index: 1;
          margin-top: 50px;
          width: 40px;
          height: 40px;
        }

        .map-center:before, .map-center:after {
          content: "";
          position: absolute;
          z-index: 1;
          background: ${theme.border};
        }

        .map-center:before {
          left: 50%;
          width: 2px;
          height: 100%;
        }

        .map-center:after {
          top: 50%;
          height: 2px;
          width: 100%;
        }
      `}</style>
    </div>
  )
}

AddressMap.propTypes = {
  map: PropTypes.object.isRequired,
  marker: PropTypes.object.isRequired,
  popup: PropTypes.object.isRequired,
  data: PropTypes.object,
  loading: PropTypes.bool,
  center: PropTypes.array,
  zoom: PropTypes.number,
  mapUpdate: PropTypes.func.isRequired,
  setMarkerCoordinates: PropTypes.func.isRequired
}

AddressMap.defaultProps = {
  data: true,
  loading: false,
  center: null,
  zoom: null
}

export default AddressMap
