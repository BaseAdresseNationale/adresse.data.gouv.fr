import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import {MapPin} from 'react-feather'

function OpenGPS({lat, lon}) {
  return (
    <Link href={`geo:${lat}, ${lon}`} passHref>
      <button
        type='button'
        className='mapboxgl-ctrl'
        title='Ouvrir le GPS'
      >
        <MapPin size={18} />
      </button>
    </Link>
  )
}

OpenGPS.propTypes = {
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired
}

export default OpenGPS
