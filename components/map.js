import React from 'react'
import {Map, Marker, Popup, TileLayer} from 'react-leaflet'

import mapStyle from 'leaflet/dist/leaflet.css'

const position = [48.72568, -3.985908]

class LeafletMap extends React.Component {
  render() {
    return (
      <div>
        <Map center={position} zoom={13}>
          <TileLayer
            url='//wxs.ign.fr/14repeswer1lgaj7p7yergsz/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGN&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg'
            attribution='Fond de plan \u00a9 <a href="http://www.ign.fr/">IGN</a>, Adresses BAN sous licence ODbL' />
          <Marker position={position}>
            <Popup>
              <span>A pretty CSS3 popup.<br />Easily customizable.</span>
            </Popup>
          </Marker>
        </Map>

        <style dangerouslySetInnerHTML={{__html: mapStyle}} />

        <style jsx>{`
          div {
            width: 100%;
            position: fixed;
            top: 70px;
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
        `}</style>
      </div>
    )
  }
}

export default LeafletMap
