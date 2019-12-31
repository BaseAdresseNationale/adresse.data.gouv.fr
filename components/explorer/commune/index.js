import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import computeBbox from '@turf/bbox'

import theme from '../../../styles/theme'

import {getCommune} from '../../../lib/explore/api'

import Mapbox from '../../mapbox'
import AddressesMap from '../../mapbox/addresses-map'

import Statistics from './statistics'

import Head from './head'
import Codes from './codes'

const Commune = ({commune}) => {
  const [statsPromise, setStatsPromise] = useState(null)

  useEffect(() => {
    setStatsPromise(getCommune(commune.code))
  }, [commune])

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
        <Statistics promise={statsPromise} style={{width: '200px'}} />
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
  }).isRequired
}

export default Commune
