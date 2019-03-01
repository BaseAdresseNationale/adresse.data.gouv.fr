import React from 'react'
import PropTypes from 'prop-types'
import computeBbox from '@turf/bbox'

import Mapbox from '../mapbox'

import {getNumeroPositions} from '../../lib/bal/item'
import {contoursToGeoJson, hasFeatures, toponymeToGeoJson, numeroPositionsToGeoJson} from '../../lib/geojson'

import CommuneMap from './commune-map'

class CommuneVisualizer extends React.PureComponent {
  state = {
    bbox: null,
    loading: false
  }

  componentDidMount() {
    this.fitBounds()
  }

  componentDidUpdate(prevProps) {
    const {context} = this.props

    if (context !== prevProps.context) {
      this.fitBounds()
    }
  }

  static propTypes = {
    context: PropTypes.string.isRequired,
    commune: PropTypes.shape({
      code: PropTypes.string.isRequired
    }).isRequired,
    voies: PropTypes.object,
    numeros: PropTypes.object,
    voie: PropTypes.object,
    numero: PropTypes.object,
    actions: PropTypes.shape({
      select: PropTypes.func.isRequired
    }).isRequired
  }

  static defaultProps = {
    voies: null,
    numeros: null,
    voie: null,
    numero: null
  }

  fitBounds = () => {
    const {commune, voies, voie, numeros, numero} = this.props
    const contourCommune = contoursToGeoJson([commune])
    const contourFeatures = hasFeatures(contourCommune) ? contourCommune.features : null
    let bboxFeatures = numeros && numeros.features ? numeros.features : contourFeatures // Commune contour bounds OR France bounds if undefined

    if (numero && getNumeroPositions(numero).length > 0) {
      bboxFeatures = numeroPositionsToGeoJson(numero).features // Numéro positions bounds
    } else if (voie) {
      if (voie.position) { // Toponyme bounds
        bboxFeatures = toponymeToGeoJson(voie).features
      } else if (numeros && hasFeatures(numeros)) {
        const numerosVoie = numeros.features.filter(n => n.properties.codeVoie === voie.codeVoie)
        const numerosVoieWithPos = numerosVoie.filter(n => n.properties.positions.length > 0)

        if (numerosVoieWithPos.length > 0) {
          bboxFeatures = numerosVoie // Voie bounds
        }
      }
    } else if (voies && hasFeatures(voies) && voies.features.filter(voie => voie.properties.positions).length > 0) {
      bboxFeatures = voies.features // Commune bounds
    }

    const bbox = bboxFeatures ?
      computeBbox({
        type: 'FeatureCollection',
        features: bboxFeatures
      }) :
      null

    this.setState({bbox})
  }

  selectVoie = voie => {
    const {commune, actions} = this.props

    if (voie) {
      actions.select(commune.code, voie.codeVoie)
    } else {
      actions.select(commune.code)
    }
  }

  selectNumero = numero => {
    const {numeros, actions} = this.props
    const num = numeros.features.find(n => n.properties.id === numero.id)
    const {codeCommune, codeVoie, numeroComplet} = num.properties

    actions.select(codeCommune, codeVoie, numeroComplet)
  }

  isLoading = loading => {
    if (this.state.loading !== loading) {
      this.setState({loading})
    }
  }

  render() {
    const {bbox, loading} = this.state
    const {voies, numeros, voie, numero, actions} = this.props
    const positions = numero && !numero.deleted ? numeroPositionsToGeoJson(numero) : null

    return (
      <div style={{position: 'relative'}}>
        {loading && (
          <div className='loading' onWheel={this.handleWheel}>Chargement…</div>
        )}

        <Mapbox bbox={bbox} fullscreen>
          {(map, marker, popup) => (
            <CommuneMap
              map={map}
              popup={popup}
              voies={voies}
              numeros={numeros}
              voie={voie}
              numero={numero}
              positions={positions}
              selectVoie={this.selectVoie}
              selectNumero={this.selectNumero}
              isLoading={this.isLoading}
              actions={actions}
            />
          )}
        </Mapbox>

        <style jsx>{`
          .loading {
            z-index: 999;
            position: absolute;
            background-color: #ffffffCC;
            padding: 1em;
            border-radius: 4px;
            top: 1em;
            left: 1em;
          }
          `}</style>
      </div>
    )
  }
}

export default CommuneVisualizer
