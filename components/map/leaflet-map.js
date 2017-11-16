import React from 'react'
import PropTypes from 'prop-types'
import L from 'leaflet'
import {Map, TileLayer, Marker} from 'react-leaflet'

import mapStyle from 'leaflet/dist/leaflet.css'

const LeafletMap = ({position, zoom}) => {
  const iconUrl = '../../static/images/map/marker-icon.png'

  return (
    <div>
      <Map center={position} zoom={zoom}>
        <TileLayer
          url='//wxs.ign.fr/14repeswer1lgaj7p7yergsz/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGN&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg'
          attribution='Fond de plan \u00a9 <a href="http://www.ign.fr/">IGN</a>, Adresses BAN sous licence ODbL' />

        <Marker position={position} icon={L.icon({iconUrl})} />
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
