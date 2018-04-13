import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import LoadingContent from '../../loading-content'

const loadingStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  backgroundColor: 'whitesmoke'
}

const GeojsonMap = dynamic(import('../../mapbox/geojson-map'), {
  ssr: false,
  loading: () => (
    <div style={loadingStyle}>
      <LoadingContent loading>
        Chargement…
      </LoadingContent>
    </div>
  )
})

const Map = ({contour}) => (
  contour ?
    <GeojsonMap data={contour} /> :
    <GeojsonMap />
)

Map.propTypes = {
  contour: PropTypes.object.isRequired
}

export default Map
