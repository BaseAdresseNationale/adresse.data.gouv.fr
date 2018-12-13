import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import mapboxgl from 'mapbox-gl'
import mapStyle from 'mapbox-gl/dist/mapbox-gl.css'

import SwitchInput from '../explorer/table-list/filters/switch-input'

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

class Map extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      currentStyle: props.ortho ? 'ortho' : 'vector',
      shouldRender: false
    }
  }

  static propTypes = {
    switchStyle: PropTypes.bool,
    height: PropTypes.string,
    ortho: PropTypes.bool,
    fullscreen: PropTypes.bool,
    children: PropTypes.func.isRequired
  }

  static defaultProps = {
    height: '600',
    ortho: false,
    fullscreen: false,
    switchStyle: false
  }

  componentDidMount() {
    const {currentStyle} = this.state

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: STYLES[currentStyle],
      center: [1.7, 46.9],
      zoom: 5
    })

    this.marker = new mapboxgl.Marker()
    this.popUp = new mapboxgl.Popup()

    this.marker.setPopup(new mapboxgl.Popup())

    this.setState({shouldRender: true})
  }

  switchLayer = () => {
    const {map} = this

    this.setState(state => {
      const currentStyle = state.currentStyle === 'vector' ? 'ortho' : 'vector'
      map.setStyle(STYLES[currentStyle], {diff: true})

      return {
        currentStyle
      }
    })
  }

  render() {
    const {currentStyle, shouldRender} = this.state
    const {switchStyle, height, fullscreen, children} = this.props

    return (
      <div className='container'>
        <div className='tools'>
          {shouldRender && children(this.map, this.marker, this.popUp)}

          <div ref={el => {
            this.mapContainer = el
          }} className='map-container' />
        </div>

        {switchStyle && (
          <SwitchInput
            handleChange={this.switchLayer}
            label='Vue aérienne'
            isChecked={currentStyle === 'ortho'}
          />
        )}

        <Head>
          <style key='mapbox'
            dangerouslySetInnerHTML={{__html: mapStyle}} // eslint-disable-line react/no-danger
          />
        </Head>

        <style jsx>{`
          .container {
            width: 100%;
            height: ${fullscreen ? 'calc(100vh - 75px)' : `${height}px`};
          }

          @media (max-width: 700px) {
            .container {
              height: ${fullscreen ? 'calc(100vh - 130px)' : `${height}px`};
            }
          }

          @media (max-width: 380px) {
            .container {
              height: ${fullscreen ? 'calc(100vh - 120px)' : `${height}px`};
            }
          }

          .tools {
            display: flex;
            flex-flow: wrap;
            height: 100%;
          }

          .map-container {
            position: relative;
            min-width: 250px;
            height: 100%;
            flex: 1;
          }

        `}</style>

      </div>
    )
  }
}

export default Map
