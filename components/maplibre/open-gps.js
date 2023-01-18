import {useContext} from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import {Navigation} from 'react-feather'

import DeviceContext from '@/contexts/device'

import ActionButtonNeutral from '@/components/action-button-neutral'

function OpenGPS({coordinates}) {
  const {isSafariBrowser} = useContext(DeviceContext)
  const {lat, lon} = coordinates
  const href = isSafariBrowser ? 'http://maps.apple.com/?address=' : 'geo:'

  return (
    <Link href={`${href}${lat},${lon}`} passHref legacyBehavior>
      <ActionButtonNeutral label='Naviguer sur la carte'>
        <div className='maplibregl-ctrl navigation-icon'>
          <Navigation size={18} />

          <style jsx>{`
            .navigation-icon {
              width: 29px;
              height: 29px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          `}</style>
        </div>
      </ActionButtonNeutral>
    </Link>
  );
}

OpenGPS.propTypes = {
  coordinates: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired
  }).isRequired
}

export default OpenGPS
