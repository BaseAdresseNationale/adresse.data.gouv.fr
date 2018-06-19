/* eslint react/no-danger: off, react/style-prop-object: off */
import React from 'react'
import PropTypes from 'prop-types'
import ReactMapboxGl from 'react-mapbox-gl'

// eslint-disable-next-line new-cap
const Map = ReactMapboxGl({})

const containerStyle = {
  height: '100%',
  width: '100%',
  boxShadow: '0 1px 4px #C9D3DF'
}

class Mapbox extends React.Component {
  render() {
    const {center, zoom, onStyleLoad, onDrag, onZoom, onClick, children} = this.props

    return (
      <Map
        zoom={[zoom]}
        onClick={onClick}
        movingMethod='jumpTo'
        onDragEnd={onDrag}
        onZoomEnd={onZoom}
        onStyleLoad={onStyleLoad}
        style='https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json'
        center={center}
        containerStyle={containerStyle}>
        {children}
      </Map>
    )
  }
}

Mapbox.propTypes = {
  center: PropTypes.array.isRequired,
  zoom: PropTypes.number,
  children: PropTypes.node.isRequired,
  onDrag: PropTypes.func.isRequired,
  onZoom: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onStyleLoad: PropTypes.func
}

Mapbox.defaultProps = {
  zoom: 13,
  onStyleLoad: null
}

export default Mapbox
