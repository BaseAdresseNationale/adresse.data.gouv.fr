import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import {MapPin} from 'react-feather'

function OpenGPS({lat, lon, isSafariBrowser}) {
  const href = isSafariBrowser ? 'http://maps.apple.com/?address=' : 'geo:'

  return (
    <Link href={`${href}${lat},${lon}`} passHref>
      <button
        type='button'
        className='mapboxgl-ctrl'
      >
        <MapPin size={18} />
      </button>
    </Link>
  )
}

OpenGPS.propTypes = {
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  isSafariBrowser: PropTypes.bool.isRequired
}

export default OpenGPS
