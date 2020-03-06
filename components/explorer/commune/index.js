import React from 'react'
import PropTypes from 'prop-types'
import computeBbox from '@turf/bbox'

import theme from '../../../styles/theme'

import Mapbox from '../../mapbox'
import AddressesMap from '../../mapbox/addresses-map'

import Statistics from './statistics'

import Head from './head'
import Codes from './codes'

const Commune = ({commune, voiesInfos}) => {
  const {sourcesNomsVoies, sourcesPositions} = voiesInfos
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
        {!isBal && (
          <Statistics sources={{sourcesNomsVoies, sourcesPositions}} />
        )}
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
  voiesInfos: PropTypes.shape({
    sourcesNomsVoies: PropTypes.object.isRequired,
    sourcesPositions: PropTypes.object.isRequired
  }).isRequired
}

export default Commune
