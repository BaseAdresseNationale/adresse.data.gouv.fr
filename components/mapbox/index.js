/* eslint react/no-danger: off, react/style-prop-object: off */
import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import ReactMapboxGl from 'react-mapbox-gl'
import bbox from '@turf/bbox'
import {intersectionWith, isEqual} from 'lodash'

import Notification from '../notification'

// eslint-disable-next-line new-cap
const Map = ReactMapboxGl({})

function isWebglSupported() {
  try {
    const canvas = document.createElement('canvas')

    return Boolean(window.WebGLRenderingContext) && (
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    )
  } catch (err) {
    return false
  }
}

const fullscreenStyle = {
  height: '100vh',
  width: '100vw'
}

const containerStyle = {
  height: '100%',
  width: '100%',
  boxShadow: '0 1px 4px #C9D3DF'
}

class Mapbox extends React.Component {
  constructor(props) {
    super(props)

    this.bbox = bbox(props.data)
  }

  componentDidMount() {
    this.bbox = null
  }

  componentWillReceiveProps(props) {
    const {data} = this.props
    this.bbox = null

    const intersection = intersectionWith(data.features, props.data.features, isEqual)

    if (intersection.length === 0) {
      this.bbox = bbox(props.data)
    }
  }

  getBounds = () => {
    const {bbox} = this

    if (bbox) {
      return [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]]
      ]
    }
  }

  render() {
    const {fullscreen, onStyleLoad, children} = this.props

    return (
      <Fragment>
        {
          isWebglSupported() ?
            <Map
              onStyleLoad={onStyleLoad}
              style='https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json'
              fitBounds={this.getBounds()}
              fitBoundsOptions={{padding: 20, linear: true}}
              containerStyle={fullscreen ? fullscreenStyle : containerStyle}>
              {children}
            </Map> :
            <div className='webgl-error'>
              <Notification type='error' message='WebGL' />
            </div>
        }
        <style jsx>{`
          .webgl-error {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
          }
        `}</style>
      </Fragment>

    )
  }
}

Mapbox.propTypes = {
  data: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  onStyleLoad: PropTypes.func,
  fullscreen: PropTypes.bool
}

Mapbox.defaultProps = {
  onStyleLoad: null,
  fullscreen: false
}

export default Mapbox
