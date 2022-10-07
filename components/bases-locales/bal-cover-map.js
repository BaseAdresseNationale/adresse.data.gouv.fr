import React from 'react'
import {renderToString} from 'react-dom/server'
import PropTypes from 'prop-types'
import {AlertTriangle} from 'react-feather'

import theme from '@/styles/theme'

const popupHTML = ({nom, organization, license}) => renderToString(
  <div>
    <p>
      <b>{nom}</b>
    </p>
    {organization && (
      <div>Producteur : {organization}</div>
    )}
    {license && (
      <div>Licence : {license}</div>
    )}
  </div>
)

class BalCoverMap extends React.Component {
  static propTypes = {
    map: PropTypes.object.isRequired,
    data: PropTypes.object,
    popup: PropTypes.object,
    setSources: PropTypes.func.isRequired,
    setLayers: PropTypes.func.isRequired
  }

  static defaultProps = {
    data: null,
    popup: null
  }

  state = {
    zoomActivated: false,
    warningZoom: false
  }

  componentDidMount() {
    const {map, data, setSources, setLayers} = this.props
    const sources = [{
      name: 'data',
      type: 'geojson',
      generateId: true,
      data
    }]
    const layers = [
      {
        id: 'bal-polygon-fill',
        type: 'fill',
        source: 'data',
        paint: {
          'fill-color': theme.colors.green,
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.5,
            0.2
          ]
        },
        filter: ['==', '$type', 'Polygon']
      },
      {
        id: 'bal-polygon-outline',
        type: 'line',
        source: 'data',
        paint: {
          'line-color': theme.colors.green,
          'line-width': 1
        },
        filter: ['==', '$type', 'Polygon']
      }
    ]

    setSources(sources)
    setLayers(layers)

    map.once('load', () => {
      map.doubleClickZoom.disable()

      map.on('mousemove', 'bal-polygon-fill', this.onMouseMove.bind(this, 'bal-polygon-fill'))
      map.on('mouseleave', 'bal-polygon-fill', this.onMouseLeave.bind(this, 'bal-polygon-fill'))
      map.on('wheel', this.onWheel.bind(this))

      map.on('dblclick', this.onDblClick.bind(this))
    })
  }

  componentDidUpdate() {
    const {map} = this.props

    if (this.state.zoomActivated) {
      map.scrollZoom.enable()
    } else {
      map.scrollZoom.disable()
    }

    if (this.state.warningZoom) {
      const timer = setTimeout(() => this.setState({warningZoom: false}), 2000)
      return () => {
        clearTimeout(timer)
      }
    }
  }

  componentWillUnmount() {
    const {map} = this.props

    map.off('styledata', this.onStyleData)

    map.off('mousemove', 'bal-polygon-fill', this.onMouseMove.bind(this, 'bal-polygon-fill'))
    map.off('mouseleave', 'bal-polygon-fill', this.onMouseLeave.bind(this, 'bal-polygon-fill'))
    map.off('wheel', this.onWheel.bind(this))

    map.off('dblclick', this.onDblClick.bind(this))
  }

  onMouseMove = (layer, event) => {
    const {map, data, popup} = this.props
    const canvas = map.getCanvas()
    canvas.style.cursor = 'pointer'

    const [feature] = event.features

    if (this.highlighted) {
      map.setFeatureState({source: 'data', id: this.highlighted}, {hover: false})
    }

    this.highlighted = feature.id
    map.setFeatureState({source: 'data', id: this.highlighted}, {hover: true})

    const _data = data.features.find(f =>
      f.properties.id === feature.properties.id
    )

    popup.setLngLat(event.lngLat)
      .setHTML(popupHTML(_data.properties))
      .addTo(map)
  }

  onMouseLeave = () => {
    const {map, popup} = this.props
    const canvas = map.getCanvas()
    canvas.style.cursor = ''

    if (this.highlighted) {
      map.setFeatureState({source: 'data', id: this.highlighted}, {hover: false})
    }

    popup.remove()
  }

  onWheel = () => {
    if (this.state.zoomActivated) {
      this.setState({warningZoom: false})
    } else {
      this.setState({warningZoom: true})
    }
  }

  onDblClick = () => {
    this.setState(state => ({
      zoomActivated: !state.zoomActivated
    }))
  }

  render() {
    return (
      <div>
        {this.state.warningZoom && (
          <div className='warning'>
            <AlertTriangle color='orange' alt='Avertissement' />
            <div className='warning-text'>
              Double-cliquez sur la carte pour activer le zoom
            </div>
          </div>
        )}

        <style jsx>{`
          .warning {
            z-index: 1;
            position: absolute;
            display: flex;
            align-items: center;
            padding: 1em;
            margin: 1em;
            background: #ffffffc4;
          }

          .warning-text {
            margin-left: 1em;
          }
        `}</style>
      </div>
    )
  }
}

export default BalCoverMap
