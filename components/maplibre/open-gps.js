import {useContext} from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import {Navigation} from 'react-feather'

import DeviceContext from '@/contexts/device'

function OpenGPS({coordinates}) {
  const {isSafariBrowser} = useContext(DeviceContext)
  const {lat, lon} = coordinates
  const href = isSafariBrowser ? 'http://maps.apple.com/?address=' : 'geo:'

  return (
    <Link href={`${href}${lat},${lon}`} passHref>
      <button
        type='button'
        className='maplibregl-ctrl'
      >
        <Navigation size={18} />
      </button>
    </Link>
  )
}

OpenGPS.propTypes = {
  coordinates: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired
  }).isRequired
}

export default OpenGPS
