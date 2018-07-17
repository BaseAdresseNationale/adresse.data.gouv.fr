/* eslint react/no-danger: off, react/style-prop-object: off */
import React from 'react'
import PropTypes from 'prop-types'
import ReactMapboxGl from 'react-mapbox-gl'
import bbox from '@turf/bbox'
import {intersectionWith, isEqual} from 'lodash'

// eslint-disable-next-line new-cap
const Map = ReactMapboxGl({})

const fullscreenStyle = {
  height: 'calc(100vh - 75px)',
  width: '100vw'
}

const containerStyle = {
  height: '100%',
  width: '100%',
  boxShadow: '0 1px 4px #C9D3DF'
}

class MapboxGL extends React.Component {
  constructor(props) {
    super(props)

    this.bbox = bbox(props.data)
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    fitBoundsMaxZoom: PropTypes.number,
    onStyleLoad: PropTypes.func,
    fullscreen: PropTypes.bool
  }

  static defaultProps = {
    onStyleLoad: null,
    fitBoundsMaxZoom: 22,
    fullscreen: false
  }

  componentDidMount() {
    this.bbox = null
  }

  UNSAFE_componentWillReceiveProps(props) {
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
    const {fitBoundsMaxZoom, fullscreen, onStyleLoad, children} = this.props

    return (
      <Map
        onStyleLoad={onStyleLoad}
        style='https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json'
        fitBounds={this.getBounds()}
        fitBoundsOptions={{padding: 20, linear: true, maxZoom: fitBoundsMaxZoom}}
        containerStyle={fullscreen ? fullscreenStyle : containerStyle}
      >
        {children}
      </Map>
    )
  }
}

export default MapboxGL
