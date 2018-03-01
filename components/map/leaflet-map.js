/* eslint react/no-danger: off */
import React from 'react'
import PropTypes from 'prop-types'
import L from 'leaflet'
import {Map, TileLayer, Marker} from 'react-leaflet'

import mapStyle from 'leaflet/dist/leaflet.css'

L.Icon.Default.imagePath = '/static/images/leaflet/'

const LeafletMap = ({position, zoom}) => {
  return (
    <div>
      <Map center={position} zoom={zoom}>
        <TileLayer
          url='https://tile.jawg.io/sunny/{z}/{x}/{y}.png?api-key=community'
          attribution='Carte &copy; <a href="http://www.jawg.io/">jawgmap</a> / <a href="https://osm.org/copyright">OpenStreetMap</a>, Adresses BAN sous licence ODbL' />

        <Marker position={position} />
      </Map>

      <style dangerouslySetInnerHTML={{__html: mapStyle}} />

      <style jsx>{`
        div {
          width: 100%;
          position: fixed;
          top: 74px;
          bottom: 0;
          left: 0;
          right: 0;
        }

        div :global(.leaflet-container) {
          height: 100%;
        }

        div :global(.photon-input) {
          width: 400px;
        }

        div :global(.leaflet-right) {
          right: calc(50% - 200px);
        }

        @media (max-width: 550px) {
          div {
            width: 100%;
            top: 164px;
          }
        }
      `}</style>
    </div>
  )
}

LeafletMap.propTypes = {
  position: PropTypes.array,
  zoom: PropTypes.number
}

LeafletMap.defaultProps = {
  position: [48.8583701, 2.2944813],
  zoom: 13
}

export default LeafletMap
