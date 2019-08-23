/* eslint react/no-danger: off */
import React, {useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'

import theme from '../../styles/theme'

const Address = ({id, context, label, name, postcode, citycode, type, city, district, oldcity, oldcitycode}) => {
  const types = {
    locality: 'Lieu-dit',
    street: 'Voie',
    housenumber: 'Numéro'
  }

  return (
    <div>
      <h3>{types[type]}</h3>
      <p>
        <div>{name}</div>
        {district && <div>{district}</div>}
        <div>{postcode} {city}</div>
        {oldcity && (
          <div>Anciennement {oldcitycode} {oldcity}</div>
        )}
        <div>Code INSEE : {citycode}</div>
      </p>
      <div>Contexte : {context}</div>
      <div>Label : {label}</div>
      <div>ID : {id}</div>
    </div>
  )
}

Address.propTypes = {
  id: PropTypes.string.isRequired,
  context: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  postcode: PropTypes.string.isRequired,
  citycode: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired
}

const AddressMap = ({map, marker, data, handleDrag, handleZoom, setMarkerCoordinates, setInfos}) => {
  const onDragEnd = useCallback(() => {
    const {lng, lat} = map.getCenter()
    handleDrag([lng, lat])
  }, [handleDrag, map])

  const onZoom = useCallback(() => {
    const zoom = map.getZoom()
    handleZoom(zoom)
  }, [handleZoom, map])

  const inBounds = useCallback(lnglat => {
    const bounds = map.getBounds()
    let lng

    const multLng = (lnglat[0] - bounds._ne.lng) * (lnglat[0] - bounds._sw.lng)
    if (bounds._ne.lng > bounds._sw.lng) {
      lng = multLng < 0
    } else {
      lng = multLng > 0
    }

    const lat = (lnglat[1] - bounds._ne.lat) * (lnglat[1] - bounds._sw.lat) < 0
    return lng && lat
  }, [map])

  useEffect(() => {
    map.on('dragend', onDragEnd)
    map.on('zoomend', onZoom)

    return () => {
      map.off('dragend', onDragEnd)
      map.off('zoomend', onZoom)
    }

    // No dependency in order to mock a didMount and avoid duplicating events.
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data) {
      const center = data.geometry.coordinates
      const zoom = map.getZoom()

      if (zoom < 15) {
        map.setZoom(18)
      }

      setMarkerCoordinates(center)

      if (!inBounds(center)) {
        map.setCenter(center)
      }

      setInfos(<Address {...data.properties} />)
    } else {
      setMarkerCoordinates(null)
      setInfos(null)
    }
  }, [data, inBounds, map, marker, setInfos, setMarkerCoordinates])

  return (
    <div>
      <div className='map-center centered' />
      <style jsx>{`
        .centered {
          z-index: 1;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .map-center {
          z-index: 1;
          width: 40px;
          height: 40px;
        }

        .map-center:before, .map-center:after {
          content: "";
          position: absolute;
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
  data: PropTypes.object,
  handleDrag: PropTypes.func.isRequired,
  handleZoom: PropTypes.func.isRequired,
  setMarkerCoordinates: PropTypes.func.isRequired,
  setInfos: PropTypes.func.isRequired
}

AddressMap.defaultProps = {
  data: true
}

export default AddressMap
