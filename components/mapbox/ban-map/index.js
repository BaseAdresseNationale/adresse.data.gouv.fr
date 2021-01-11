import React, {useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'

import CenterControl from '../center-control'

import {adresseCircleLayer, adresseLabelLayer, adresseCompletLabelLayer, voieLayer, toponymeLayer} from './layers'
import popupFeatures from './popups'
import {forEach} from 'lodash'

let hoveredVoieId = null

const SOURCES = ['adresses', 'toponymes']

function BanMap({map, isSourceLoaded, popup, address, setSources, setLayers, onSelect}) {
  const onLeave = useCallback(() => {
    if (hoveredVoieId) {
      highLightVoie(false)
    }

    popup.remove()
    map.getCanvas().style.cursor = 'grab'
    hoveredVoieId = null
  }, [map, popup, highLightVoie])

  const highLightVoie = useCallback(isHovered => {
    forEach(SOURCES, sourceLayer => {
      forEach(map.querySourceFeatures('base-adresse-nationale', {
        sourceLayer,
        filter: ['in', hoveredVoieId, ['get', 'id']]
      }), ({id}) => {
        map.setFeatureState({source: 'base-adresse-nationale', sourceLayer, id}, {hover: isHovered})
      })
    })
  }, [])

  const onHover = useCallback(e => {
    if (e.features.length > 0) {
      if (hoveredVoieId) {
        highLightVoie(false)
      }

      hoveredVoieId = e.features[0].id.split('_').slice(0, 2).join('_')
      highLightVoie(true)

      map.getCanvas().style.cursor = 'pointer'
      popup.setLngLat(e.lngLat)
        .setHTML(popupFeatures(e.features))
        .addTo(map)
    } else {
      map.getCanvas().style.cursor = 'grab'
      popup.remove()
    }
  }, [map, popup, highLightVoie])

  const handleClick = (e, cb) => {
    const feature = e.features[0]
    cb(feature.properties)
  }

  const centerAddress = () => {
    map.fitBounds(address.displayBBox)
  }

  useEffect(() => {
    map.on('mousemove', 'adresse', onHover)
    map.on('mousemove', 'adresse-label', onHover)
    map.on('mousemove', 'voie', onHover)
    map.on('mousemove', 'toponyme', onHover)

    map.on('mouseleave', 'adresse', onLeave)
    map.on('mouseleave', 'adresse-label', onLeave)
    map.on('mouseleave', 'voie', onLeave)
    map.on('mouseleave', 'toponyme', onLeave)

    map.on('click', 'adresse', e => handleClick(e, onSelect))
    map.on('click', 'adresse-label', e => handleClick(e, onSelect))
    map.on('click', 'voie', e => handleClick(e, onSelect))
    map.on('click', 'toponyme', e => handleClick(e, onSelect))

    return () => {
      map.off('mousemove', 'adresse', onHover)
      map.off('mousemove', 'adresse-label', onHover)
      map.off('mousemove', 'voie', onHover)
      map.off('mousemove', 'toponyme', onHover)

      map.off('mouseleave', 'adresse', onLeave)
      map.off('mouseleave', 'adresse-label', onLeave)
      map.off('mouseleave', 'adresse', onLeave)
      map.off('mouseleave', 'adresse-label', onLeave)

      map.off('click', 'adresse', e => handleClick(e, onSelect))
      map.off('click', 'adresse-label', e => handleClick(e, onSelect))
      map.off('click', 'voie', e => handleClick(e, onSelect))
      map.off('click', 'toponyme', e => handleClick(e, onSelect))
    }

    // No dependency in order to mock a didMount and avoid duplicating events.
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setSources([{
      name: 'base-adresse-nationale',
      type: 'vector',
      format: 'pbf',
      tiles: [
        'https://plateforme.adresse.data.gouv.fr/tiles/ban/{z}/{x}/{y}.pbf'
      ],
      minzoom: 10,
      maxzoom: 14,
      promoteId: 'id'
    }])
    setLayers([
      adresseCircleLayer,
      adresseLabelLayer,
      adresseCompletLabelLayer,
      voieLayer,
      toponymeLayer
    ])
  }, [setSources, setLayers])

  useEffect(() => {
    if (isSourceLoaded && map.getLayer('adresse-complet-label') && map.getLayer('adresse-label')) {
      if (address && address.type === 'numero') {
        const {id} = address
        map.setFilter('adresse-complet-label', [
          '==', ['get', 'id'], id
        ])
        map.setFilter('adresse-label', [
          '!=', ['get', 'id'], id
        ])
      } else {
        map.setFilter('adresse-complet-label', [
          '==', ['get', 'id'], ''
        ])
        map.setFilter('adresse-label', [
          '!=', ['get', 'id'], ''
        ])
      }
    }
  }, [map, isSourceLoaded, address, setLayers])

  return (
    <CenterControl handleClick={centerAddress} />
  )
}

BanMap.defaultProps = {
  address: null,
  onSelect: () => {}
}

BanMap.propTypes = {
  address: PropTypes.shape({
    type: PropTypes.string.isRequired,
    position: PropTypes.object.isRequired
  }),
  map: PropTypes.object.isRequired,
  contour: PropTypes.shape({
    features: PropTypes.array.isRequired
  }),
  onSelect: PropTypes.func,
  setSources: PropTypes.func.isRequired,
  setLayers: PropTypes.func.isRequired
}

export default BanMap
