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

const Map = ({contour}) => {
  const GeojsonMap = dynamic(import('../../mapbox-gl/geojson-map'), {
    ssr: false,
    loading: () => (
      <div style={loadingStyle}>
        <LoadingContent loading>
          Chargement…
      </LoadingContent>
      </div>
    )
  })

  return (
    <div className='map'>
      {contour ?
        <GeojsonMap data={contour} /> :
        <GeojsonMap />
      }
      <style jsx>{`
      .map {
        width: 100%;
        height: 420px;
      }
    `}</style>
    </div>
  )
}

Map.propTypes = {
  contour: PropTypes.object.isRequired
}

export default Map
