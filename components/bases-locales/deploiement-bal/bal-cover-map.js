import React from 'react'
import {renderToString} from 'react-dom/server'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {AlertTriangle} from 'react-feather'

import SelectPaintLayer from '@/components/maplibre/select-paint-layer'
import MapLegends from '@/components/maplibre/map-legends'

import {DEFAULT_CENTER, DEFAULT_ZOOM} from '@/components/maplibre/map'
import theme from '@/styles/theme'

const ADRESSE_URL = process.env.NEXT_PUBLIC_ADRESSE_URL || 'http://localhost:3000'

const paintLayers = {
  source: {
    name: 'Déploiement BAL',
    legend: [
      {
        title: 'Déploiement BAL',
        content: {
          mesadresses: {name: 'Mes Adresses', color: theme.colors.mapGreen},
          moissoneur: {name: 'Moissonneur', color: theme.colors.mapOrange},
          form: {name: 'Formulaire', color: theme.colors.mapBlue},
          api: {name: 'Api', color: theme.colors.mapYellow},
        }
      },
      {
        title: 'BAN',
        content: {
          other: {name: 'Assemblage', color: '#ddd'},
        }
      }
    ],
    paint: {
      styles: [
        {
          expression: [
            ['==', ['get', 'hasBAL'], true],
            ['==', ['get', 'idClient'], 'mes-adresses']
          ], // Mes Adresses
          color: theme.colors.mapGreen
        },
        {
          expression: [
            ['==', ['get', 'hasBAL'], true],
            ['==', ['get', 'idClient'], 'moissonneur-bal']
          ], // Moissonneur
          color: theme.colors.mapOrange
        },
        {
          expression: [
            ['==', ['get', 'hasBAL'], true],
            ['==', ['get', 'idClient'], 'formulaire-publication']
          ], // Formaulaire
          color: theme.colors.mapBlue
        },
        {
          expression: [
            ['==', ['get', 'hasBAL'], true],
            ['==', ['has', 'idClient'], true]
          ], // API
          color: theme.colors.mapYellow
        },
      ],
      default: '#ddd'
    }
  },
  bal: {
    name: 'Suivi Mes Adresses',
    legend: [
      {
        title: 'Mes Adresses',
        content: {
          published: {name: 'Publiée', color: theme.colors.mapGreen},
          pap: {name: 'Prête a être publiée', color: theme.colors.mapBlue},
          draft: {name: 'Brouillon', color: theme.colors.mapYellow},
        }
      },
      {
        title: 'Autre source',
        content: {
          other: {name: 'Api, formulaire, moissonneur', color: theme.colors.mapOrange},
        }
      }
    ],

    paint: {
      styles: [
        {
          expression: [
            ['==', ['get', 'statusBals'], 'published'],
          ], // Mes Adresses
          color: theme.colors.mapGreen
        },
        {
          expression: [
            ['==', ['get', 'statusBals'], 'ready-to-publish'],
          ], // Mes Adresses
          color: theme.colors.mapBlue
        },
        {
          expression: [
            ['==', ['get', 'statusBals'], 'draft'],
          ], // Mes Adresses
          color: theme.colors.mapYellow
        },
        {
          expression: [
            ['==', ['get', 'hasBAL'], true],
          ],
          color: theme.colors.mapOrange
        },
      ],
      default: '#ddd'
    }
  }
}

const popupHTML = ({nom, code, nbNumeros, certificationPercentage, nomClient, hasBAL}) => renderToString(
  <div>
    <p>
      <b>{nom} ({code})</b>
    </p>
    <div>Nombre d’adresses : {nbNumeros}</div>
    <div>{`${certificationPercentage ? `Taux de certification : ${certificationPercentage}%` : 'Aucune adresse n’est certifiée par la commune'}`}</div>
    {hasBAL ? <div>Déposé via : {nomClient}</div> : <div>Ne dispose pas d&apos;une BAL</div>}
  </div>
)

class BalCoverMap extends React.Component {
  static propTypes = {
    map: PropTypes.object.isRequired,
    popup: PropTypes.object,
    setSources: PropTypes.func.isRequired,
    setLayers: PropTypes.func.isRequired,
    center: PropTypes.arrayOf(PropTypes.number),
    zoom: PropTypes.number,
    filteredCodesCommmune: PropTypes.arrayOf(PropTypes.string),
    selectedPaintLayer: PropTypes.string.isRequired,
    setSelectedPaintLayer: PropTypes.func.isRequired,
  }

  static defaultProps = {
    popup: null,
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    filteredCodesCommmune: []
  }

  state = {
    zoomActivated: false,
    warningZoom: false,
    currentCenter: null,
  }

  componentDidMount() {
    const {map, setSources, setLayers, center} = this.props
    const sources = [{
      name: 'data',
      type: 'vector',
      format: 'pbf',
      promoteId: 'code',
      tiles: [`${ADRESSE_URL}/deploiement/couverture-tiles/{z}/{x}/{y}.pbf`]
    }]
    const layers = [
      {
        id: 'bal-polygon-fill',
        type: 'fill',
        source: 'data',
        'source-layer': 'communes',
        paint: {
          'fill-color': this.createStyle(),
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.8,
            0.6
          ]
        },
        filter: ['==', '$type', 'Polygon']
      }
    ]
    this.setState({currentCenter: center})
    setSources(sources)
    setLayers(layers)

    map.once('load', () => {
      map.doubleClickZoom.disable()
      map.on('mousemove', 'bal-polygon-fill', this.onMouseMove.bind(this, 'bal-polygon-fill'))
      map.on('mouseleave', 'bal-polygon-fill', this.onMouseLeave.bind(this, 'bal-polygon-fill'))
      map.on('wheel', this.onWheel.bind(this))

      map.on('dblclick', this.onDblClick.bind(this))
      map.on('click', 'bal-polygon-fill', this.onClick.bind(this, 'bal-polygon-fill'))
    })
  }

  componentDidUpdate() {
    const {map, center, zoom} = this.props
    const polygonFillLayer = map.getLayer('bal-polygon-fill')
    if (polygonFillLayer) {
      map.setPaintProperty('bal-polygon-fill', 'fill-color', this.createStyle())
    }

    if (this.state.zoomActivated) {
      map.scrollZoom.enable()
    } else {
      map.scrollZoom.disable()
    }

    if (this.state.currentCenter !== center) {
      map.setCenter(center)
      map.setZoom(zoom)
      this.setState({currentCenter: center})
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
    map.off('click', 'bal-polygon-fill', this.onClick.bind(this, 'bal-polygon-fill'))
  }

  createStyle = () => {
    const {filteredCodesCommmune} = this.props
    const stylePaint = ['case']

    paintLayers[this.props.selectedPaintLayer].paint.styles.forEach(style => {
      const {expression, color} = style
      const exp = [
        'all',
        ...expression,
      ]
      if (filteredCodesCommmune.length > 0) {
        const inFilteredCommunesExp = ['in', ['get', 'code'], ['literal', filteredCodesCommmune]]
        exp.push(inFilteredCommunesExp)
      }

      stylePaint.push(exp, color)
    })
    if (filteredCodesCommmune.length > 0) {
      stylePaint.push(
        ['in', ['get', 'code'], ['literal', filteredCodesCommmune]],
        '#ddd',
        'transparent')
    } else {
      stylePaint.push(paintLayers[this.props.selectedPaintLayer].paint.default)
    }

    return stylePaint
  }

  onMouseMove = (layer, event) => {
    const {map, popup, filteredCodesCommmune} = this.props
    const canvas = map.getCanvas()
    canvas.style.cursor = 'pointer'

    const [feature] = event.features

    if (this.highlighted) {
      map.setFeatureState({source: 'data', sourceLayer: 'communes', id: this.highlighted}, {hover: false})
    }

    this.highlighted = feature.id
    map.setFeatureState({source: 'data', sourceLayer: 'communes', id: this.highlighted}, {hover: true})

    if (filteredCodesCommmune.length === 0 || filteredCodesCommmune.includes(feature.properties.code)) {
      popup.setLngLat(event.lngLat)
        .setHTML(popupHTML(feature.properties))
        .addTo(map)
    } else {
      popup.remove()
    }
  }

  onMouseLeave = () => {
    const {map, popup} = this.props
    const canvas = map.getCanvas()
    canvas.style.cursor = ''

    if (this.highlighted) {
      map.setFeatureState({source: 'data', sourceLayer: 'communes', id: this.highlighted}, {hover: false})
    }

    popup.remove()
  }

  onClick = (layer, event) => {
    const [feature] = event.features
    Router.push(`/commune/${feature.id}`)
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
        <SelectPaintLayer
          options={paintLayers}
          selected={this.props.selectedPaintLayer}
          handleSelect={this.props.setSelectedPaintLayer}
        >
          {
            paintLayers[this.props.selectedPaintLayer].legend.map(l => (
              <MapLegends key={l.title} title={l.title} legend={l.content} />
            ))
          }
        </SelectPaintLayer>

        {this.state.warningZoom && (
          <div className='warning'>
            <AlertTriangle color='orange' alt='Avertissement' />
            <div className='warning-text'>
              Double-cliquez sur la carte pour activer le zoom
            </div>
          </div>
        )}

        <style jsx>{`
          .legend-container {
            position: absolute;
            text-align: left;
            box-shadow: none;
            border: 2px solid #dcd8d5;
            border-radius: 4px;
            z-index: 1;
            padding: 0.5em;
            left: 13px;
            top: 8px;
            background-color: rgba(255,255,255,0.9);
          }

          .warning {
            z-index: 1;
            position: absolute;
            display: flex;
            align-items: center;
            padding: 1em;
            margin: 20em 20em;
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
