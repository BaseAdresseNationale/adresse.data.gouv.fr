import { Layer, Source } from 'react-map-gl/maplibre'
import type { Address } from '../types'

interface PropsLayerIGNJ1 {
  address: Address
  isVisible?: boolean
}

function LayerIGNJ1({ isVisible }: PropsLayerIGNJ1) {

  return (
    <Source
      id="planign_j1_layer"
      type="raster"
      tiles={[
        'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS.BDUNI.J1&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image/png',
      ]}
      tileSize={256}
      maxzoom={22}
    >

      <Layer
        id="planign_j1_layer"
        type="raster"
        paint={{
          'raster-opacity': 0.7,
        }}
        layout={{
          visibility: isVisible ? 'visible' : 'none',
        }}
      />
      
    </Source>
  )
}

export default LayerIGNJ1
