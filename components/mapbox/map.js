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

let currentStyle = 'vector'

class Map extends React.PureComponent {
  state = {
    shouldRender: false
  }

  static propTypes = {
    switchStyle: PropTypes.bool,
    height: PropTypes.string,
    fullscreen: PropTypes.bool,
    children: PropTypes.func.isRequired
  }

  static defaultProps = {
    height: '600',
    fullscreen: false,
    switchStyle: false
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: STYLES[currentStyle],
      center: [1.7191, 46.7111]
    })

    this.marker = new mapboxgl.Marker()
    this.popUp = new mapboxgl.Popup()

    this.marker.setPopup(this.popUp)

    this.setState({shouldRender: true})
  }

  switchLayer = () => {
    const {map} = this

    currentStyle = currentStyle === 'vector' ? 'ortho' : 'vector'

    map.setStyle(STYLES[currentStyle], {diff: true})
  }

  render() {
    const {shouldRender} = this.state
    const {switchStyle, height, fullscreen, children} = this.props

    return (
      <div className='container'>
        <div className='tools'>
          {shouldRender && children(this.map, this.marker)}

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
            height: ${fullscreen ? '100vh' : `${height}px`};
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
