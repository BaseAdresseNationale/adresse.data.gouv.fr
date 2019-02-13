import React from 'react'
import PropTypes from 'prop-types'

import Mapbox from '../mapbox'

import {contoursToGeoJson, hasFeatures} from '../../lib/geojson'

import CommuneMap from './commune-map'

class CommuneVisualizer extends React.Component {
  state = {
    loading: false
  }

  static propTypes = {
    commune: PropTypes.shape({
      code: PropTypes.string.isRequired,
      contour: PropTypes.object.isRequired
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

  selectVoie = voie => {
    const {commune, actions} = this.props

    if (voie) {
      actions.select(commune.code, voie.codeVoie)
    } else {
      actions.select(commune.code)
    }
  }

  selectNumero = numeroId => {
    const {numeros, actions} = this.props
    const numero = numeros.features.find(n => n.properties.id === numeroId)
    const {codeCommune, codeVoie, numeroComplet} = numero.properties

    actions.select(codeCommune, codeVoie, numeroComplet)
  }

  isLoading = loading => {
    if (this.state.loading !== loading) {
      this.setState({loading})
    }
  }

  render() {
    const {loading} = this.state
    const {commune, voies, numeros, voie, numero, actions} = this.props
    const contourCommune = contoursToGeoJson([commune])

    return (
      <div style={{position: 'relative'}}>
        {loading && (
          <div className='loading' onWheel={this.handleWheel}>Chargement…</div>
        )}

        <Mapbox switchStyle>
          {(map, marker, popup) => (
            <CommuneMap
              map={map}
              popup={popup}
              contourCommune={hasFeatures(contourCommune) ? contourCommune.features : null}
              voies={voies}
              numeros={numeros}
              voie={voie}
              numero={numero}
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
