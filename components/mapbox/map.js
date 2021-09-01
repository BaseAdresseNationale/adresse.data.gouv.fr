import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import mapboxgl from 'mapbox-gl'
import mapStyle from 'mapbox-gl/dist/mapbox-gl.css'

import vector from './styles/vector.json'

import Notification from '../notification'

import SwitchMapStyle from './switch-map-style'

import useMarker from './hooks/marker'
import usePopup from './hooks/popup'

const DEFAULT_CENTER = [1.7, 46.9]
const DEFAULT_ZOOM = 4.4

const STYLES = {
  vector,
  ortho: {
    version: 8,
    glyphs: 'https://orangemug.github.io/font-glyphs/glyphs/{fontstack}/{range}.pbf',
    sources: {
      'raster-tiles': {
        type: 'raster',
        tiles: ['https://wxs.ign.fr/essentiels/geoportail/wmts?layer=ORTHOIMAGERY.ORTHOPHOTOS&style=normal&tilematrixset=PM&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={z}&TileCol={x}&TileRow={y}'],
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

function Map({hasSwitchStyle, bbox, defaultStyle, hasHash, defaultCenter, defaultZoom, isInteractive, hasControl, isLoading, error, children}) {
  const [map, setMap] = useState(null)
  const [mapContainer, setMapContainer] = useState(null)
  const [isFirstLoad, setIsFirstLoad] = useState(false)
  const [isStyleLoaded, setIsStyleLoaded] = useState(true)
  const [isSourceLoaded, setIsSourceLoaded] = useState(false)
  const [style, setStyle] = useState(defaultStyle)
  const [sources, setSources] = useState([])
  const [layers, setLayers] = useState([])
  const [infos, setInfos] = useState(null)
  const [tools, setTools] = useState(null)
  const [marker, setMarkerCoordinates] = useMarker(map)
  const [popup] = usePopup(marker)
  const [mapError, setMapError] = useState(error)

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
    } catch {
      setMapError('Aucune position n’est renseignée')
    }
  }, [map])

  const switchLayer = useCallback(() => {
    setStyle(style === 'vector' ?
      'ortho' :
      'vector'
    )
  }, [style])

  const loadData = useCallback(() => {
    if (map && isStyleLoaded && isFirstLoad) {
      sources.forEach(source => {
        const {name, ...props} = source
        if (!map.getSource(name)) {
          map.addSource(name, props)
        }
      })

      layers.forEach(layer => {
        if (!map.getLayer(layer.id)) {
          map.addLayer(layer)
        }
      })
    }
  }, [map, isFirstLoad, isStyleLoaded, layers, sources])

  const onSourceData = useCallback(event => {
    setIsSourceLoaded(event.isSourceLoaded)
  }, [])

  useEffect(() => {
    loadData()
  }, [sources, layers, style, isStyleLoaded, loadData])

  useEffect(() => {
    if (mapContainer) {
      const map = new mapboxgl.Map({
        container: mapContainer,
        style: STYLES[style],
        center: defaultCenter || DEFAULT_CENTER,
        zoom: defaultZoom || DEFAULT_ZOOM,
        maxZoom: 19,
        hash: hasHash,
        isInteractive
      })

      if (hasControl) {
        map.addControl(new mapboxgl.NavigationControl({showCompass: false}))
      }

      map.on('load', loadData)
      map.on('sourcedata', onSourceData)
      map.once('load', () => {
        setIsFirstLoad(true)
      })

      setMap(map)

      return () => {
        map.off('load', loadData)
        map.off('sourcedata', onSourceData)
      }
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
      map.setStyle(STYLES[style])

      const onStyleData = () => {
        setIsStyleLoaded(false)
        if (map.isStyleLoaded) {
          setIsStyleLoaded(true)
        } else {
          setTimeout(onStyleData, 200)
        }
      }

      map.on('styledata', onStyleData)

      return () => {
        map.off('styledata', onStyleData)
      }
    }
  }, [style]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='mapbox-container'>
      <div className='map'>
        {mapError && (
          <div className='tools error'>
            <Notification type='error' message={mapError} />
          </div>
        )}

        {!mapError && isLoading && (
          <div className='tools'>Chargement…</div>
        )}

        {!isLoading && !mapError && infos && (
          <div className='tools'>{infos}</div>
        )}

        {!isLoading && !mapError && tools && (
          <div className='tools right'>{tools}</div>
        )}

        {map && children({
          map,
          marker,
          popup,
          style,
          isSourceLoaded,
          setSources,
          setLayers,
          setInfos,
          setTools,
          setMarkerCoordinates
        })}

        <div ref={mapRef} className='map-container' />

        {hasSwitchStyle && (
          <div className='tools bottom switch'>
            <SwitchMapStyle
              isVector={style === 'vector'}
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
            max-height: ${hasSwitchStyle ? 'calc(100% - 116px)' : '100%'};
            overflow-y: ${hasSwitchStyle ? 'scroll' : 'initial'};
            z-index: 900;
            padding: 0.5em;
            margin: 1em;
            border-radius: 4px;
            background-color: #ffffffbb;
            max-width: 80%;
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

          @media (max-width: 380px) {
            .tools {
              margin: 0.5em;
            }
          }
        `}</style>

    </div>
  )
}

Map.propTypes = {
  hasSwitchStyle: PropTypes.bool,
  bbox: PropTypes.array,
  defaultStyle: PropTypes.oneOf([
    'vector',
    'ortho'
  ]),
  isInteractive: PropTypes.bool,
  hasControl: PropTypes.bool,
  hasHash: PropTypes.bool,
  defaultCenter: PropTypes.array,
  defaultZoom: PropTypes.number,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
  children: PropTypes.func.isRequired
}

Map.defaultProps = {
  bbox: null,
  defaultStyle: 'vector',
  isInteractive: true,
  hasControl: true,
  hasHash: false,
  defaultCenter: DEFAULT_CENTER,
  defaultZoom: DEFAULT_ZOOM,
  isLoading: false,
  error: null,
  hasSwitchStyle: false
}

export default Map
