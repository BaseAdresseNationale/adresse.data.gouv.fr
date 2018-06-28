import React from 'react'
import PropTypes from 'prop-types'

import Meta from '../../meta'

import Map from './map'

class Preview extends React.Component {
  static propTypes = {
    infos: PropTypes.array.isRequired,
    geojson: PropTypes.object.isRequired,
    report: PropTypes.object
  }

  static defaultProps = {
    report: null
  }

  render() {
    const {infos, report, geojson} = this.props

    return (
      <div className='container'>
        <div className='content'>
          <Meta infos={infos} report={report} />

          <div className='map'>
            {geojson && <Map geojson={geojson} />}
          </div>
        </div>

        <style jsx>{`
          .container {
            margin: 2em 0;
          }

          .content {
            display: flex;
            justify-content: space-between;
          }

          .content > div {
            width: 50%;
          }

          @media (max-width: 680px) {
            .content {
              flex-direction: column;
            }

            .content > div {
              width: 100%;
              margin: 1em 0;
            }
          }
        `}</style>
      </div>
    )
  }
}

export default Preview
