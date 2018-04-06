import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

const GeojsonMap = dynamic(import('../../mapbox/geojson-map'), {
  ssr: false,
  loading: () => (
    <div style={{width: '200px'}}>
      Chargement…
    </div>
  )
})

const Map = ({contour}) => (
  <div className='map'>
    {contour ?
      <GeojsonMap data={contour} /> :
      <GeojsonMap />
    }
    <style jsx>{`
      .map {
        grid-column: 3 / 3;
        grid-row: 1;
        height: 320px;
      }
      `}</style>
  </div>
)

Map.propTypes = {
  contour: PropTypes.object.isRequired
}

export default Map
