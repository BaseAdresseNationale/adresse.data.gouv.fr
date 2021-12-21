import {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import maplibregl from 'maplibre-gl'
import mapStyle from 'maplibre-gl/dist/maplibre-gl.css'

import theme from '@/styles/theme'

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
        attribution: '<a target="_blank" href="https://geoservices.ign.fr/documentation/donnees/ortho/bdortho" /> © IGN </a>'
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
  const [isSourceLoaded, setIsSourceLoaded] = useState(false)
  const [isStyleLoaded, setIsStyleLoaded] = useState(true)
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
        const {name, ...properties} = source
        const src = map.getSource(name)

        if (src && properties.data) {
          src.setData(properties.data)
        } else if (!src) {
          map.addSource(name, properties)
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
    if (map) {
      map.setStyle(STYLES[style])

      const onStyleData = () => {
        if (map.isStyleLoaded()) {
          setIsStyleLoaded(true)
        } else {
          setIsStyleLoaded(false)
          setTimeout(onStyleData, 200)
        }
      }

      map.on('style.load', onStyleData)

      return () => {
        map.off('style.load', onStyleData)
      }
    }
  }, [style]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (mapContainer) {
      const map = new maplibregl.Map({
        container: mapContainer,
        style: STYLES[style],
        center: defaultCenter || DEFAULT_CENTER,
        zoom: defaultZoom || DEFAULT_ZOOM,
        maxZoom: 19,
        hash: hasHash,
        isInteractive
      })

      if (hasControl) {
        map.addControl(new maplibregl.NavigationControl({showCompass: false}))
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

  return (
    <div className='maplibre-container'>
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
        <style key='maplibre'
          dangerouslySetInnerHTML={{__html: mapStyle}} // eslint-disable-line react/no-danger
        />
      </Head>

      <style jsx>{`
          .maplibre-container {
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
            z-index: 10;
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

          @media (max-width: ${theme.breakPoints.mobile}) {
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
