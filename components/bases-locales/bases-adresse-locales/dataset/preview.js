import React from 'react'
import PropTypes from 'prop-types'

import MapBox from '../../../mapbox'

import GeojsonMap from '../../../mapbox-gl/geojson-map'

class Preview extends React.Component {
  static propTypes = {
    geojson: PropTypes.object,
    children: PropTypes.node.isRequired
  }

  static defaultProps = {
    geojson: null
  }

  render() {
    const {geojson, children} = this.props

    return (
      <div className='container'>
        <div className='content'>
          {children}

          <div className='map'>
            {geojson && (
              <MapBox height='300'>
                {map => (
                  <GeojsonMap
                    map={map}
                    data={geojson}
                  />
                )}
              </MapBox>
            )}
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

          .map {
            width: 50%;
          }

          @media (max-width: 680px) {
            .content {
              flex-direction: column;
            }

            .map {
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
