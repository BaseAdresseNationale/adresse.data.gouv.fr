import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import mapboxgl from 'mapbox-gl'
import mapStyle from 'mapbox-gl/dist/mapbox-gl.css'

import Notification from '../notification'

import SwitchMapStyle from './switch-map-style'

import useMarker from './hooks/marker'
import usePopup from './hooks/popup'

const STYLES = {
  vector: 'https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json',
  ortho: {
    version: 8,
    glyphs: 'https://orangemug.github.io/font-glyphs/glyphs/{fontstack}/{range}.pbf',
    sources: {
      'raster-tiles': {
        type: 'raster',
        tiles: ['https://wxs.ign.fr/eop8s6g4hrpvxnxer1g6qu44/geoportail/wmts?layer=ORTHOIMAGERY.ORTHOPHOTOS&style=normal&tilematrixset=PM&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={z}&TileCol={x}&TileRow={y}'],
        tileSize: 256,
        attribution: '© IGN'
      }
    },
    layers: [{
      id: 'simple-tiles',
      type: 'raster',
      source: 'raster-tiles'
    }]
  }
}

const Map = ({switchStyle, bbox, defaultStyle, interactive, loading, error, children}) => {
  const [map, setMap] = useState(null)
  const [mapContainer, setMapContainer] = useState(null)
  const [isFirstLoad, setIsFirstLoad] = useState(false)
  const [style, setStyle] = useState(defaultStyle)
  const [sources, setSources] = useState([])
  const [layers, setLayers] = useState([])
  const [marker, setMarkerCoordinates] = useMarker(map)
  const [popup] = usePopup(marker)

  const mapRef = useCallback(ref => {
    if (ref) {
      setMapContainer(ref)
    }
  }, [])

  const fitBounds = useCallback(bbox => {
    map.fitBounds(bbox, {
      padding: 30,
      linear: true,
      maxZoom: 19,
      duration: 0
    })
  })

  const switchLayer = useCallback(() => {
    setStyle(style === 'vector' ?
      'ortho' :
      'vector'
    )
  })

  const loadSources = useCallback(() => {
    sources.forEach(source => {
      const {name, ...properties} = source
      if (!map.getSource(name)) {
        map.addSource(name, properties)
      }
    })
  }, [sources])

  const loadLayers = useCallback(() => {
    layers.forEach(layer => {
      if (!map.getLayer(layer.id)) {
        map.addLayer(layer)
      }
    })
  }, [layers])

  useEffect(() => {
    if (mapContainer) {
      const map = new mapboxgl.Map({
        container: mapContainer,
        style: STYLES[style],
        center: [1.7, 46.9],
        zoom: 5,
        interactive
      })

      setMap(map)
      map.once('load', () => setIsFirstLoad(true))
    }
  }, [mapContainer])

  const onStyleData = () => {
    if (map.isStyleLoaded()) {
      loadSources()
      loadLayers()
    } else {
      setTimeout(onStyleData, 1000)
    }
  }

  useEffect(() => {
    if (bbox && map) {
      fitBounds(bbox)
    }
  }, [map, bbox])

  useEffect(() => {
    if (isFirstLoad && sources && layers) {
      loadSources()
      loadLayers()
    }
  }, [isFirstLoad, sources, layers])

  useEffect(() => {
    if (map) {
      map.setStyle(STYLES[style], {diff: false})
      map.on('styledata', onStyleData)
    }
  }, [style])

  useEffect(() => {
    if (sources.length > 0) {
      sources.forEach(({name, data}) => {
        const source = map.getSource(name)
        if (source) {
          source.setData(data)
        }
      })
    }
  }, [sources])

  useEffect(() => {
    if (isFirstLoad && map && sources.length > 0) {
      loadSources()
    }
  }, [isFirstLoad, map, sources])

  useEffect(() => {
    if (isFirstLoad && map && layers.length > 0) {
      loadLayers()
    }
  }, [isFirstLoad, map, layers])

  return (
    <div className='mapbox-container'>
      <div className='map'>
        {loading && (
          <div className='tools'>Chargement…</div>
        )}

        {error && (
          <div className='tools'>
            <Notification type='error' message={error} />
          </div>
        )}

        {map && children({
          map,
          marker,
          popup,
          style,
          setSources,
          setLayers,
          setMarkerCoordinates
        })}

        <div ref={mapRef} className='map-container' />

        {switchStyle && (
          <div className='tools bottom switch'>
            <SwitchMapStyle
              vector={style === 'vector'}
              handleChange={switchLayer}
            />
          </div>
        )}

      </div>

      <Head>
        <style key='mapbox'
          dangerouslySetInnerHTML={{__html: mapStyle}} // eslint-disable-line react/no-danger
        />
      </Head>

      <style jsx>{`
          .mapbox-container {
            width: 100%;
            height: 100%;
          }

          .map-container {
            min-width: 250px;
            flex: 1;
          }

          .map {
            display: flex;
            height: 100%;
          }

          .tools {
            position: absolute;
            z-index: 999;
            padding: 0.5em;
            margin: 1em;
            border-radius: 4px;
            background-color: #ffffffbb;
          }

          .bottom {
            display: flex;
            flex-direction: column;
            bottom: -5px;
            left: 0;
          }

          .switch {
            background-color: none;
            padding: 0;
          }
        `}</style>

    </div>
  )
}

Map.propTypes = {
  switchStyle: PropTypes.bool,
  bbox: PropTypes.array,
  defaultStyle: PropTypes.oneOf([
    'vector',
    'ortho'
  ]),
  interactive: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.object,
  children: PropTypes.func.isRequired
}

Map.defaultProps = {
  bbox: null,
  defaultStyle: 'vector',
  interactive: true,
  loading: false,
  error: null,
  switchStyle: false
}

export default Map
