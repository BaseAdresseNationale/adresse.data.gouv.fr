import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

const LeafletMap = dynamic(import('../../leaflet-map'), {
  ssr: false,
  loading: () => (
    <div style={{width: '200px'}}>
      Chargement…
    </div>
  )
})

const Map = ({centre, contour}) => (
  <div className='map'>
    {centre && contour ?
      <LeafletMap
        data={contour}
        center={centre.coordinates.reverse()}
        zoom={13} /> :
      <LeafletMap />
    }
    <style jsx>{`
      .map {
        grid-column: 3 / 3;
        grid-row: 1;
      }
      `}</style>
  </div>
)

Map.propTypes = {
  centre: PropTypes.object.isRequired,
  contour: PropTypes.object.isRequired
}

export default Map
