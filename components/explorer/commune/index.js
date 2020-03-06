import React from 'react'
import PropTypes from 'prop-types'
import computeBbox from '@turf/bbox'

import theme from '../../../styles/theme'

import withFetch from '../../hoc/with-fetch'

import Mapbox from '../../mapbox'
import AddressesMap from '../../mapbox/addresses-map'

import Statistics from './statistics'

import Head from './head'
import Codes from './codes'

const Commune = ({commune, sourcesNomsVoies, sourcesPositions}) => {
  const isBal = Object.keys(sourcesNomsVoies)[0] === 'commune-bal'

  return (
    <div>
      <Head {...commune} />

      <div className='head'>
        <Codes {...commune} />
      </div>

      <div className='preview'>
        <div className='explore-commune-map'>
          <Mapbox bbox={computeBbox(commune.contour)} switchStyle>
            {({...mapboxProps}) => (
              <AddressesMap
                {...mapboxProps}
                contour={commune.contour}
              />
            )}
          </Mapbox>
        </div>
        <div className={isBal ? 'bal' : 'notBal'}>
          {!isBal &&
            <Statistics
              sources={{sourcesNomsVoies, sourcesPositions}}
            />}
        </div>
      </div>

      <style jsx>{`
      .head {
        background-color: ${theme.primary};
        color: ${theme.colors.white};
      }

      .preview {
        display: flex;
        flex-direction: row;
      }

      .explore-commune-map {
        flex: 1;
        height: 500px;
      }

      .bal {
        position: relative;
        display: none;
        width: 0;
      }

      @media (max-width: 749px) {
        .explore-commune-map {
          flex-direction: column;
        }

        .preview {
          display: inherit;
          flex-direction: column;
        }
      }
      `}</style>
    </div>
  )
}

Commune.propTypes = {
  commune: PropTypes.shape({
    code: PropTypes.string.isRequired,
    contour: PropTypes.object.isRequired
  }).isRequired,
  sourcesNomsVoies: PropTypes.objectisRequired,
  sourcesPositions: PropTypes.objectisRequired
}

export default withFetch(data => {
  const {sourcesNomsVoies, sourcesPositions} = data
  return {sourcesNomsVoies, sourcesPositions}
})(Commune)
