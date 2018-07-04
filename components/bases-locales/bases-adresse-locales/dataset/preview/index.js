import React from 'react'
import PropTypes from 'prop-types'

import Map from './map'

class Preview extends React.Component {
  static propTypes = {
    geojson: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
  }

  render() {
    const {geojson, children} = this.props

    return (
      <div className='container'>
        <div className='content'>
          {children}

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
