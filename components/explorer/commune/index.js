import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../styles/theme'

import Head from './head'
import Codes from './codes'
import Metrics from './metrics'
import Map from './map'

class Commune extends React.Component {
  render() {
    return (
      <div>
        <Head {...this.props} />

        <div className='head'>
          <Codes {...this.props} />
        </div>

        <div className='map'>
          <Metrics {...this.props} />
          <Map {...this.props} />
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
  }
}

Commune.propTypes = {
  nom: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  codesPostaux: PropTypes.array.isRequired,
  departement: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired
  }).isRequired,
  region: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired
  }).isRequired,
  centre: PropTypes.shape({
    type: PropTypes.string.isRequired,
    coordinates: PropTypes.array.isRequired
  }).isRequired,
  contour: PropTypes.shape({
    type: PropTypes.string.isRequired,
    coordinates: PropTypes.array.isRequired
  }).isRequired,
  population: PropTypes.number.isRequired,
  surface: PropTypes.number.isRequired
}

export default Commune
