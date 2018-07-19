/* eslint react/no-danger: off */
import React from 'react'
import PropTypes from 'prop-types'
import {GeoJSONLayer} from 'react-mapbox-gl'

import MapBoxGL from '../../../mapbox-gl'

import theme from '../../../../styles/theme'

const circlePaint = {
  'circle-radius': {
    stops: [
      [10, 1],
      [15, 3],
      [20, 8]
    ]
  },
  'circle-color': '#C9D3DF',
  'circle-opacity': 0.6
}

const primaryCircle = () => {
  circlePaint.color = '#3099df'
  return circlePaint
}

class geojsonMap extends React.Component {
  static propTypes = {
    context: PropTypes.object,
    positions: PropTypes.object.isRequired,
    selectNumero: PropTypes.func.isRequired
  }

  static defaultProps = {
    context: null
  }

  handleClickCircle = event => {
    const {selectNumero} = this.props
    const numeroId = event.features[0].properties.id

    selectNumero(numeroId)
  }

  render() {
    const {positions, context} = this.props

    return (
      <MapBoxGL data={positions}>

        <GeoJSONLayer
          id='positions'
          data={positions}
          circlePaint={circlePaint}
          circleOnClick={this.handleClickCircle}
        />

        {context && (
          <GeoJSONLayer
            id='context'
            data={context}
            circlePaint={() => primaryCircle}
            circleOnClick={this.handleClickCircle}
          />
        )}

        <style jsx>{`
          .centered {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }

          .map-center {
            z-index: 1;
            margin-top: -15px;
            width: 100px;
            height: 100px;
          }

          .map-center:before, .map-center:after {
            content: ';
            position: absolute;
            z-index: 1;
            background: ${theme.border};
          }

          .map-center:before {
            left: 50%;
            width: 1px;
            margin-left: 0px;
            height: 100%;
          }

          .map-center:after {
            top: 50%;
            height: 1px;
            margin-top: 25x;
            width: 100%;
          }
        `}</style>
      </MapBoxGL>
    )
  }
}

export default geojsonMap
