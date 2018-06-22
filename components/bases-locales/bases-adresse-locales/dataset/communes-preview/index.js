import React from 'react'
import PropTypes from 'prop-types'
import {sumBy} from 'lodash'

import {contoursToGeoJson} from '../../../../../lib/geojson'

import Head from './head'
import Map from './contours-map'
import Communes from './communes'

class CommunesPreview extends React.Component {
  static propTypes = {
    communes: PropTypes.arrayOf(
      PropTypes.shape({
        voiesCount: PropTypes.number.isRequired,
        numerosCount: PropTypes.number.isRequired
      })
    ).isRequired
  }

  render() {
    const {communes} = this.props
    const communesContours = contoursToGeoJson(communes)

    return (
      <div className='container'>
        <Head
          communes={communes.length}
          voies={sumBy(communes, commune => commune.voiesCount)}
          addresses={sumBy(communes, commune => commune.numerosCount)} />

        <div className='content'>
          <div className='communes'>
            <Communes communes={communes} />
          </div>

          <div className='map'>
            <Map contour={communesContours} />
          </div>
        </div>

        <style jsx>{`
          .container {
            margin: 1em 0;
          }

          .content {
            display: flex;
            flex-direction: column;
          }

          .communes {
            width: 100%;
          }
        `}</style>
      </div>
    )
  }
}

export default CommunesPreview
