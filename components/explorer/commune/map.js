import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import LoadingContent from '../../loading-content'

const loadingStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  backgroundColor: 'whitesmoke'
}

class Map extends React.PureComponent {
  state = {
    showMap: false
  }

  componentWillMount() {
    this.GeojsonMap = dynamic(import('../../mapbox-gl/geojson-map'), {
      ssr: false,
      loading: () => (
        <div style={loadingStyle}>
          <LoadingContent loading>
            Chargement…
          </LoadingContent>
        </div>
      )
    })

    this.setState({showMap: true})
  }

  render() {
    const {showMap} = this.state
    const {contour} = this.props
    const {GeojsonMap} = this

    return (
      <div className='map'>

        {showMap && (
          contour ?
            <GeojsonMap data={contour} /> :
            <GeojsonMap />
          )
        }

        <style jsx>{`
          .map {
            width: 100%;
            height: 420px;
          }
        `}</style>
      </div>
    )
  }

}

Map.propTypes = {
  contour: PropTypes.object.isRequired
}

export default Map
