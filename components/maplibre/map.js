import {useState, useCallback, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'

import mapStyle from 'maplibre-gl/dist/maplibre-gl.css'

import theme from '@/styles/theme'

import vector from './styles/vector.json'

import Notification from '../notification'

import SwitchMapStyle from './switch-map-style'

import ReactMap, {NavigationControl, ScaleControl} from 'react-map-gl/maplibre'

export const DEFAULT_CENTER = [1.7, 46.9]
export const DEFAULT_ZOOM = 4.4

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
  const map = useRef()
  const [style, setStyle] = useState(defaultStyle)
  const [mapError, setMapError] = useState(error)

  const fitBounds = useCallback(bbox => {
    try {
      map.current.fitBounds(bbox, {
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

  useEffect(() => {
    setMapError(error)
  }, [error])

  useEffect(() => {
    if (bbox && map.current) {
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

        <ReactMap ref={map} hash={hasHash} maxZoom={19} interactive={isInteractive} initialViewState={{bounds: bbox, zoom: defaultZoom || DEFAULT_ZOOM, latitude: defaultCenter?.[1] || DEFAULT_CENTER[1], longitude: defaultCenter?.[0] || DEFAULT_CENTER[0]}} mapStyle={STYLES[style]}>
          { children &&
            (
              <div>
                {children}
              </div>
            )}

          { hasControl && (
            <div>
              <NavigationControl position='top-right' showCompass={false} />
              <ScaleControl position='bottom-right' maxWidth={150} unit='metric' />
            </div>
          )}

          { hasSwitchStyle && (
            <div className='tools bottom switch'>
              <SwitchMapStyle
                isVector={style === 'vector'}
                handleChange={switchLayer}
              />
            </div>
          )}

        </ReactMap>
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
  children: PropTypes.node
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
