import React from 'react'
import PropTypes from 'prop-types'

import {contoursToGeoJson} from '../../../../../lib/geojson'

import Head from './head'
import Map from './contours-map'
import Communes from './communes'

class CommunesPreview extends React.Component {
  static propTypes = {
    summary: PropTypes.shape({
      communes: PropTypes.array.isRequired,
      voiesCount: PropTypes.number.isRequired,
      numerosCount: PropTypes.number.isRequired
    }).isRequired
  }

  render() {
    const {communes, voiesCount, numerosCount} = this.props.summary
    const communesContours = contoursToGeoJson(communes)

    return (
      <div className='container'>
        <Head
          communes={communes.length}
          voies={voiesCount}
          addresses={numerosCount} />

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
