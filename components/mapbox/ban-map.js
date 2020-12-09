import React, {useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {renderToString} from 'react-dom/server'

import {sources, adresseCircleLayer, adresseLabelLayer, voieLayer, toponymeLayer} from '@/components/base-adresse-nationale/layers'

const popupHTML = ({numero, suffixe, nomVoie, nomCommune, codeCommune, sourcePosition, sourceNomVoie}) => {
  const position = sources[sourcePosition]
  const nom = sources[sourceNomVoie]
  return renderToString(
    <div>
      <p>
        <b>{numero}{suffixe} {nomVoie}, {nomCommune} {codeCommune}</b>
      </p>
      <div>Nom : <span style={{color: nom.color}}>{nom.name}</span></div>
      <div>Position : <span style={{color: position.color}}>{position.name}</span></div>
    </div>
  )
}

const numeros = features => {
  return features.map(({properties}) => popupHTML(properties))
}

function BanMap({map, popup, setSources, setLayers, onSelect}) {
  const onLeave = useCallback(() => {
    popup.remove()
  }, [popup])

  const onHover = useCallback(e => {
    if (e.features.length > 0) {
      map.getCanvas().style.cursor = 'pointer'
      popup.setLngLat(e.lngLat)
        .setHTML(numeros(e.features))
        .addTo(map)
    } else {
      map.getCanvas().style.cursor = 'default'
      popup.remove()
    }
  }, [map, popup])

  const handleClick = (e, cb) => {
    const feature = e.features[0]
    cb(feature.properties)
  }

  useEffect(() => {
    map.on('mousemove', 'adresse', onHover)
    map.on('mouseleave', 'adresse', onLeave)

    map.on('mousemove', 'adresse-label', onHover)
    map.on('mouseleave', 'adresse-label', onLeave)

    map.on('click', 'adresse', e => handleClick(e, onSelect))
    map.on('click', 'voie', e => handleClick(e, onSelect))
    map.on('click', 'toponyme', e => handleClick(e, onSelect))

    return () => {
      map.off('mousemove', 'adresse', onHover)
      map.off('mouseleave', 'adresse', onLeave)

      map.off('mousemove', 'adresse-label', onHover)
      map.off('mouseleave', 'adresse-label', onLeave)

      map.off('click', 'adresse', e => handleClick(e, onSelect))
    }

    // No dependency in order to mock a didMount and avoid duplicating events.
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setSources([{
      name: 'ban-adresse-nationale',
      type: 'vector',
      url: 'https://openmaptiles.geo.data.gouv.fr/data/adresses.json',
      generateId: true
    }])
    setLayers([
      adresseCircleLayer,
      adresseLabelLayer,
      voieLayer,
      toponymeLayer
    ])
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
