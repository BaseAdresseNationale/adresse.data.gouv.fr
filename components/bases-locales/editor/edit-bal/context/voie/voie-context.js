import React from 'react'
import PropTypes from 'prop-types'

import Notification from '../../../../../notification'
import Button from '../../../../../button'

import {contoursToGeoJson, voieNumerosToGeoJson} from '../../../../../../lib/geojson'

import NumerosList from './numeros-list'
import EmptyNumeroList from './empty-numeros-list'
import ToponymeContext from './toponyme-context'

class VoieContext extends React.Component {
  static propTypes = {
    commune: PropTypes.shape({
      nom: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired
    }).isRequired,
    voie: PropTypes.shape({
      nomVoie: PropTypes.string.isRequired,
      numeros: PropTypes.object,
      position: PropTypes.object
    }).isRequired,
    addresses: PropTypes.object,
    actions: PropTypes.shape({
      addItem: PropTypes.func.isRequired,
      cancelChange: PropTypes.func.isRequired,
      select: PropTypes.func.isRequired
    }).isRequired
  }

  static defaultProps = {
    addresses: null
  }

  render() {
    const {commune, voie, addresses, actions} = this.props
    const {numeros} = voie
    const hasNumeros = numeros && Object.keys(numeros).length > 0
    const newName = voie.modified && voie.modified.nomVoie
    const voieAddresses = hasNumeros ? voieNumerosToGeoJson(voie) : null
    const communeContour = commune.contour ? contoursToGeoJson([commune]) : null
    const bounds = voieAddresses || addresses || communeContour

    return (
      <div>
        {newName && (
          <Notification type='info'>
            <div>
              <p>Anciennement nommée <b>{voie.nomVoie}</b>, vous avez renommé cette voie.</p>
              <Button
                size='small'
                onClick={() => actions.cancelChange(voie)}
              >
                Revenir au nom original
              </Button>
            </div>
          </Notification>
        )}

        {voie.position ? (
          <ToponymeContext
            voie={voie}
            actions={actions}
          />
        ) : (
          <div>
            {hasNumeros ? (
              <NumerosList
                codeCommune={commune.code}
                codeVoie={voie.codeVoie}
                numeros={numeros}
                bounds={bounds}
                actions={actions}
              />
            ) : (
              <EmptyNumeroList
                bounds={bounds}
                addNumero={actions.addItem}
              />
            )}
          </div>
        )}
      </div>
    )
  }
}

export default VoieContext
