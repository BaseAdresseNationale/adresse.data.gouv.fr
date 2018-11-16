import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../styles/theme'

import Mapbox from '../../mapbox'
import GeojsonMap from '../../mapbox-gl/geojson-map'

import Head from './head'
import Codes from './codes'
import Metrics from './metrics'

const Commune = props => (
  <div>
    <Head {...props} />

    <div className='head'>
      <Codes {...props} />
    </div>

    <div className='map'>
      <Metrics {...props} />
      <Mapbox>
        {map => (
          <GeojsonMap
            map={map}
            data={props.contour}
          />
        )}
      </Mapbox>
    </div>

    <style jsx>{`
      .head {
        background-color: ${theme.primary};
        color: ${theme.colors.white};
      }

      .map {
        display: flex;
        flex-direction: row;
      }

      .map > div {
        width: 30%;
      }

      @media (max-width: 749px) {
        .map {
          display: flex;
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
