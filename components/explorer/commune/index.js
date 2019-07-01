import React from 'react'
import PropTypes from 'prop-types'
import computeBbox from '@turf/bbox'

import theme from '../../../styles/theme'

import Mapbox from '../../mapbox'

import AddressesMap from '../../mapbox/addresses-map'

import Head from './head'
import Codes from './codes'
import Metrics from './metrics'

const Commune = props => (
  <div>
    <Head {...props} />

    <div className='head'>
      <Codes {...props} />
    </div>

    <div className='explore-commune-map'>
      <Metrics {...props} />
      <Mapbox bbox={computeBbox(props.contour)}>
        {({...mapboxProps}) => (
          <AddressesMap
            {...mapboxProps}
            contour={props.contour}
          />
        )}
      </Mapbox>
    </div>

    <style jsx>{`
      .head {
        background-color: ${theme.primary};
        color: ${theme.colors.white};
      }

      .explore-commune-map {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 300px;
      }

      @media (max-width: 749px) {
        .explore-commune-map {
          flex-direction: column;
        }
      }
      `}</style>
  </div>
)

Commune.propTypes = {
  contour: PropTypes.object.isRequired
}

export default Commune
