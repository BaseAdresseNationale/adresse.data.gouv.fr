/* eslint react/no-danger: off */
import React from 'react'
import PropTypes from 'prop-types'
import L from 'leaflet'
import {Map, TileLayer, Marker, GeoJSON} from 'react-leaflet'

import mapStyle from 'leaflet/dist/leaflet.css'

L.Icon.Default.imagePath = '/static/images/leaflet/'

class LeafletMap extends React.Component {
  render() {
    const {center, position, zoom, data, fullscreen} = this.props
    let bounds

    if (data) {
      const poly = L.polygon(data.coordinates[0].map(coord => [coord[1], coord[0]]))
      bounds = poly.getBounds()
    }

    return (
      <div className={fullscreen ? `fullscreen` : 'window'}>
        <Map center={center} zoom={zoom} bounds={bounds} scrollWheelZoom={false}>
          <TileLayer
            url='https://tilecache.openstreetmap.fr/osmfr/{z}/{x}/{y}.png'
            attribution='Map data &copy; 2012 OpenStreetMap contributors' />

          {position && <Marker position={position} />}

          {data && <GeoJSON
            key={data.coordinates[0][0][0]}
            color='blue'
            fillOpacity={0.1}
            weight={2}
            data={data} />}
        </Map>

        <style dangerouslySetInnerHTML={{__html: mapStyle}} />

        <style jsx>{`
          .fullscreen {
            width: 100%;
            position: fixed;
            top: 74px;
            bottom: 0;
            left: 0;
            right: 0;
          }

          .fullscreen :global(.leaflet-container) {
            height: 100%;
          }

          .fullscreen :global(.photon-input) {
            width: 400px;
          }

          .fullscreen :global(.leaflet-right) {
            right: calc(50% - 200px);
          }

          @media (max-width: 550px) {
            .fullscreen {
              width: 100%;
              top: 164px;
            }
          }

          .window {
            width: 100%;
            max-width: 500px;
            height: 400px;
          }

          .window :global(.leaflet-container) {
            height: 100%;
          }
        `}</style>
      </div>
    )
  }
}

LeafletMap.propTypes = {
  data: PropTypes.object,
  center: PropTypes.array,
  position: PropTypes.array,
  zoom: PropTypes.number,
  fullscreen: PropTypes.bool
}

LeafletMap.defaultProps = {
  data: null,
  position: null,
  center: [46.921982, 2.978952],
  zoom: 5,
  fullscreen: false
}

export default LeafletMap
