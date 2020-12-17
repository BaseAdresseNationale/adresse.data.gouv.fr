import {useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'

import {adresseCircleLayer, adresseLabelLayer, voieLayer, toponymeLayer} from './layers'
import popupFeatures from './popups'
import {forEach} from 'lodash'

let hoveredVoieId = null
const layersSources = [
  adresseCircleLayer,
  adresseLabelLayer,
  voieLayer,
  toponymeLayer
]

const SOURCES = ['adresses', 'toponymes']

function BanMap({map, popup, setSources, setLayers, onSelect}) {
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
    setLayers(layersSources)
  }, [setSources, setLayers])

  return null
}

BanMap.defaultProps = {
  onSelectContour: null,
  onSelect: () => {}
}

BanMap.propTypes = {
  map: PropTypes.object.isRequired,
  contour: PropTypes.shape({
    features: PropTypes.array.isRequired
  }),
  onSelectContour: PropTypes.func,
  onSelect: PropTypes.func,
  setSources: PropTypes.func.isRequired,
  setLayers: PropTypes.func.isRequired
}

export default BanMap
