import React from 'react'
import PropTypes from 'prop-types'
import computeBbox from '@turf/bbox'

import MapLibre from '@/components/maplibre'

import AddressesMap from '@/components/maplibre/addresses-map'

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
      <div className='preview-container'>
        <div className='content'>
          {children}

          <div className='preview-map-container'>
            {geojson && (
              <MapLibre bbox={computeBbox(geojson)}>
                {({...maplibreProps}) => (
                  <AddressesMap
                    {...maplibreProps}
                    contour={geojson}
                  />
                )}
              </MapLibre>
            )}
          </div>
        </div>

        <style jsx>{`
          .preview-container {
            margin: 2em 0;
          }

          .content {
            display: flex;
            justify-content: space-between;
          }

          .preview-map-container {
            width: 50%;
            height: 300px;
          }

          @media (max-width: 480px) {
            .content {
              flex-direction: column;
            }
          }
        `}</style>
      </div>
    )
  }
}

export default Preview
