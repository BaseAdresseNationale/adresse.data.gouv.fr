import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import {isWebGLSupported} from '../../../../../lib/browser/webgl'

import LoadingContent from '../../../../loading-content'
import NoWebglError from '../../../../no-web-gl-error'

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

  static propTypes = {
    geojson: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.GeojsonMap = isWebGLSupported() ? dynamic(import('../../../../mapbox-gl/geojson-map'), {
      ssr: false,
      loading: () => (
        <div style={loadingStyle}>
          <LoadingContent loading>
            Chargement…
          </LoadingContent>
        </div>
      )
    }) : () => (
      <NoWebglError />
    )

    this.setState({
      showMap: true
    })
  }

  render() {
    const {showMap} = this.state
    const {geojson} = this.props
    const {GeojsonMap} = this

    return (
      <div className='map'>

        {showMap &&
          <GeojsonMap data={geojson} />
        }

        <style jsx>{`
          .map {
            width: 100%;
            height: 260px;
          }
        `}</style>
      </div>
    )
  }
}

export default Map
