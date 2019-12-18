import React from 'react'
import PropTypes from 'prop-types'
import computeBbox from '@turf/bbox'

import theme from '../../../styles/theme'

import Mapbox from '../../mapbox'

import AddressesMap from '../../mapbox/addresses-map'

import Head from './head'
import Codes from './codes'

const Commune = props => (
  <div>
    <Head {...props} />

    <div className='head'>
      <Codes {...props} />
    </div>

    <div className='preview'>
      <div className='explore-commune-map'>
        <Mapbox bbox={computeBbox(props.contour)} switchStyle>
          {({...mapboxProps}) => (
            <AddressesMap
              {...mapboxProps}
              contour={props.contour}
            />
          )}
        </Mapbox>
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
