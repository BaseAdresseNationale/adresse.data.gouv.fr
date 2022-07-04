import PropTypes from 'prop-types'
import {Clipboard} from 'react-feather'

import Button from '@/components/button'

function CoordinatesCopy({coordinates, setCopyError, setIsCopySucceded, setIsCopyAvailable, isMobile, isSafariBrowser}) {
  const {lat, lon} = coordinates
  const href = isSafariBrowser ? 'http://maps.apple.com/?address=' : 'geo:'

  const handleClick = async () => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${lat},${lon}`)
        setIsCopySucceded(true)
      } catch (error) {
        setCopyError(error)
      }
    } else {
      setIsCopyAvailable(false)
    }
  }

  return (
    <div>
      {isMobile ? (
        <div className='mobile-button'>
          <a className='text-button' href={`${href}${lat},${lon}`}>
            <Button
              type='button'
              style={{marginRight: 1, borderRadius: '3px 0 0 3px', width: '99.5%'}}
            >
              Ouvrir dans le GPS
            </Button>
          </a>

          <Button
            type='button'
            size='small'
            style={{borderRadius: '0 3px 3px 0'}}
            onClick={handleClick}
          >
            <Clipboard alt='Copier les coordonnées' />
          </Button>
        </div>
      ) : (
        <Button
          type='button'
          size='small'
          style={{width: '100%'}}
          onClick={handleClick}
        >
          Copier la position GPS
          <Clipboard style={{marginLeft: '1em', verticalAlign: 'middle'}} alt />
        </Button>
      )}
      <style jsx>{`
        .mobile-button {
          display: flex;
          justify-content: space-between;
        }

        .text-button {
          flex-grow: 1
        }
      `}</style>
    </div>
  )
}

CoordinatesCopy.defaultProps = {
  isMobile: false
}

CoordinatesCopy.propTypes = {
  coordinates: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired
  }).isRequired,
  setCopyError: PropTypes.func.isRequired,
  setIsCopySucceded: PropTypes.func.isRequired,
  setIsCopyAvailable: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  isSafariBrowser: PropTypes.bool.isRequired
}

export default CoordinatesCopy
