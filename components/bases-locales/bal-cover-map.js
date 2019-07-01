/* eslint react/no-danger: off */
import React from 'react'
import {renderToString} from 'react-dom/server'
import PropTypes from 'prop-types'
import Router from 'next/router'

import theme from '../../styles/theme'

const popupHTML = ({properties}) => renderToString(
  <div>
    <p>
      <b>{properties.nom}</b>
    </p>
    {properties.organization && (
      <div>Producteur : {properties.organization}</div>
    )}
    {properties.license && (
      <div>Licence : {properties.license}</div>
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
          'fill-color': [
            'case',
            ['==', ['get', 'license'], 'odc-odbl'],
            theme.colors.orange,
            ['==', ['get', 'license'], 'lov2'],
            theme.colors.green,
            theme.colors.red
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.5,
            0.1
          ]
        },
        filter: ['==', '$type', 'Polygon']
      },
      {
        id: 'bal-polygon-outline',
        type: 'line',
        source: 'data',
        paint: {
          'line-color': [
            'case',
            ['==', ['get', 'license'], 'odc-odbl'],
            theme.colors.orange,
            ['==', ['get', 'license'], 'lov2'],
            theme.colors.green,
            theme.colors.red
          ],
          'line-width': 2
        },
        filter: ['==', '$type', 'Polygon']
      }
    ]

    setSources(sources)
    setLayers(layers)

    map.once('load', () => {
      map.on('mousemove', 'bal-polygon-fill', this.onMouseMove.bind(this, 'bal-polygon-fill'))
      map.on('mouseleave', 'bal-polygon-fill', this.onMouseLeave.bind(this, 'bal-polygon-fill'))

      map.on('click', 'bal-polygon-fill', this.onClick.bind(this, 'bal-polygon-fill'))
    })
  }

  componentWillUnmount() {
    const {map} = this.props

    map.off('styledata', this.onStyleData)

    map.off('mousemove', 'bal-polygon-fill', this.onMouseMove.bind(this, 'bal-polygon-fill'))
    map.off('mouseleave', 'bal-polygon-fill', this.onMouseLeave.bind(this, 'bal-polygon-fill'))

    map.off('click', 'bal-polygon-fill', this.onClick.bind(this, 'bal-polygon-fill'))
  }

  onMouseMove = (layer, event) => {
    const {map, popup} = this.props
    const canvas = map.getCanvas()
    canvas.style.cursor = 'pointer'

    const [feature] = event.features

    if (this.highlighted) {
      map.setFeatureState({source: 'data', id: this.highlighted}, {hover: false})
    }

    this.highlighted = feature.id
    map.setFeatureState({source: 'data', id: this.highlighted}, {hover: true})

    popup.setLngLat(event.lngLat)
      .setHTML(popupHTML(feature))
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

  onClick = (layer, event) => {
    const [feature] = event.features

    Router.push(
      `/bases-locales/datasets/dataset?id=${feature.properties.id}`,
      `/bases-locales/jeux-de-donnees/${feature.properties.id}`
    )
  }

  render() {
    return (
      <div className='legend'>
        <div>
          <i className='lov2' /> BAL disponible sous Licence Ouverte
        </div>
        <div>
          <i className='odbl' /> BAL disponible sous licence ODbL
        </div>

        <style jsx>{`
          .legend {
            z-index: 1;
            position: absolute;
            padding: 1em;
            margin: 1em;
            background: #ffffffc4;
            border-radius: 5px;
          }

          .legend i {
            width: 18px;
            height: 18px;
            float: left;
            margin-right: 8px;
            opacity: .7;
          }

          .legend .lov2 {
            background: ${theme.colors.green};
          }

          .legend .odbl {
            background: ${theme.colors.orange};
          }
        `}</style>
      </div>
    )
  }
}

export default BalCoverMap
