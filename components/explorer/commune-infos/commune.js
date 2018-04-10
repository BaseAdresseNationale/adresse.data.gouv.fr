import React from 'react'
import PropTypes from 'prop-types'

import FetchRouterParam from '../../fetch-router-param'

import Head from './head'
import Codes from './codes'
import Metrics from './metrics'
import Map from './map'
import Voies from './voies'

class Commune extends React.Component {
  render() {
    return (
      <div>
        <Head {...this.props} />

        <div className='grid'>
          <Codes {...this.props} />
          <Metrics {...this.props} />
          <Map {...this.props} />
        </div>

        <div className='voies'>
          <FetchRouterParam
            baseUrl='https://sandbox.geo.api.gouv.fr/explore'
            constructQuery={({codeCommune}) => `/${codeCommune}`}>
            <Voies />
          </FetchRouterParam>
        </div>

        <style jsx>{`
          .grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-gap: 10px;
            grid-auto-rows: minmax(200px, auto);
            align-items: stretch;
            justify-content: center;
          }

          .voies {
            margin-top: 2em;
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
