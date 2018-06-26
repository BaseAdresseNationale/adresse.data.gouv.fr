import React from 'react'
import PropTypes from 'prop-types'

import Head from './head'
import Map from './map'
import List from './list'

class Preview extends React.Component {
  static propTypes = {
    counters: PropTypes.array.isRequired,
    list: PropTypes.array.isRequired,
    filter: PropTypes.func.isRequired,
    toItem: PropTypes.func.isRequired,
    geojson: PropTypes.object,
    points: PropTypes.bool
  }

  render() {
    const {counters, list, filter, toItem, geojson, points} = this.props

    return (
      <div className='container'>
        <Head counters={counters} />

        <div className='content'>
          <div className='list'>
            <List
              list={list}
              filter={filter}
              toItem={toItem} />
          </div>

          <div className='map'>
            {geojson && <Map geojson={geojson} points={points} />}
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

export default Preview
