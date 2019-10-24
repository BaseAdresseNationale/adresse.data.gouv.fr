import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import mapboxgl from 'mapbox-gl'
import mapStyle from 'mapbox-gl/dist/mapbox-gl.css'

import Notification from '../notification'

import SwitchMapStyle from './switch-map-style'

import useMarker from './hooks/marker'
import usePopup from './hooks/popup'
import useLoadData from './hooks/load-data'

const DEFAULT_CENTER = [1.7, 46.9]
const DEFAULT_ZOOM = 5

const STYLES = {
  vector: 'https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json',
  ortho: {
    version: 8,
    glyphs: 'https://orangemug.github.io/font-glyphs/glyphs/{fontstack}/{range}.pbf',
    sources: {
      'raster-tiles': {
        type: 'raster',
        tiles: ['https://tiles.geo.api.gouv.fr/photographies-aeriennes/tiles/{z}/{x}/{y}'],
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

const Map = ({switchStyle, bbox, defaultStyle, defaultCenter, defaultZoom, interactive, control, loading, error, children}) => {
  const [map, setMap] = useState(null)
  const [mapContainer, setMapContainer] = useState(null)
  const [isFirstLoad, setIsFirstLoad] = useState(false)
  const [style, setStyle] = useState(defaultStyle)
  const [sources, setSources] = useState([])
  const [layers, setLayers] = useState([])
  const [infos, setInfos] = useState(null)
  const [tools, setTools] = useState(null)
  const [marker, setMarkerCoordinates] = useMarker(map)
  const [popup] = usePopup(marker)
  const [mapError, setMapError] = useState(error)

  const reloadData = useLoadData(map, isFirstLoad, sources, layers)

  const mapRef = useCallback(ref => {
    if (ref) {
      setMapContainer(ref)
    }
  }, [])

  const fitBounds = useCallback(bbox => {
    try {
      map.fitBounds(bbox, {
        padding: 30,
        linear: true,
        maxZoom: 19,
        duration: 0
      })
    } catch (error) {
      setMapError('Aucune position n’est renseignée')
    }
  }, [map])

  const switchLayer = useCallback(() => {
    setStyle(style === 'vector' ?
      'ortho' :
      'vector'
    )
  }, [style])

  useEffect(() => {
    if (mapContainer) {
      const map = new mapboxgl.Map({
        container: mapContainer,
        style: STYLES[style],
        center: defaultCenter || DEFAULT_CENTER,
        zoom: defaultZoom || DEFAULT_ZOOM,
        interactive
      })

      if (control) {
        map.addControl(new mapboxgl.NavigationControl({showCompass: false}))
      }

      map.once('load', () => {
        setIsFirstLoad(true)
      })

      setMap(map)
    }

    // Map should only be created when its container is ready
    // and should not be re-created
  }, [mapContainer]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setMapError(error)
  }, [error])

  useEffect(() => {
    if (bbox && map) {
      fitBounds(bbox)
    }
  }, [map, bbox, fitBounds])

  useEffect(() => {
    if (map) {
      map.setStyle(STYLES[style], {diff: false})
    }
  }, [map, style])

  useEffect(() => {
    if (isFirstLoad) {
      const onStyleData = () => {
        if (map.isStyleLoaded()) {
          reloadData()
        } else {
          setTimeout(onStyleData, 1000)
        }
      }

      map.on('styledata', onStyleData)

      return () => {
        map.off('styledata', onStyleData)
      }
    }
    // Event styledata should only be added when map exists
    // and its first loading is completed.
  }, [isFirstLoad]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='mapbox-container'>
      <div className='map'>
        {mapError && (
          <div className='tools error'>
            <Notification type='error' message={mapError} />
          </div>
        )}

        {!mapError && loading && (
          <div className='tools'>Chargement…</div>
        )}

        {!loading && !mapError && infos && (
          <div className='tools'>{infos}</div>
        )}

        {!loading && !mapError && tools && (
          <div className='tools right'>{tools}</div>
        )}

        {map && children({
          map,
          marker,
          popup,
          style,
          setSources,
          setLayers,
          setInfos,
          setTools,
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
            position: relative;
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
            max-height: ${switchStyle ? 'calc(100% - 116px)' : '100%'};
            overflow-y: ${switchStyle ? 'scroll' : 'initial'};
            z-index: 900;
            padding: 0.5em;
            margin: 1em;
            border-radius: 4px;
            background-color: #ffffffbb;
          }

          .right {
            right: 0;
          }

          .bottom {
            bottom: 0;
            left: 0;
          }

          .switch {
            background-color: none;
            padding: 0;
            overflow: hidden;
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
  control: PropTypes.bool,
  defaultCenter: PropTypes.array,
  defaultZoom: PropTypes.number,
  loading: PropTypes.bool,
  error: PropTypes.object,
  children: PropTypes.func.isRequired
}

Map.defaultProps = {
  bbox: null,
  defaultStyle: 'vector',
  interactive: true,
  control: true,
  defaultCenter: DEFAULT_CENTER,
  defaultZoom: DEFAULT_ZOOM,
  loading: false,
  error: null,
  switchStyle: false
}

export default Map
