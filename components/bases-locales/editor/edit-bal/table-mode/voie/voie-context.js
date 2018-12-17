import React from 'react'
import PropTypes from 'prop-types'

import getStatus from '../../../../../../lib/bal/item'
import {contoursToGeoJson} from '../../../../../../lib/geojson'

import Notification from '../../../../../notification'
import Button from '../../../../../button'
import Mapbox from '../../../../../mapbox'

import Head from '../head'
import AddressesCommuneMap from '../addresses-commune-map'

import NumerosList from './numeros-list'
import EmptyNumeroList from './empty-numeros-list'
import ToponymeContext from './toponyme-context'

const getVoieAddresses = (codeCommune, voie) => {
  const geojson = {
    type: 'FeatureCollection',
    features: []
  }

  if (Object.keys(voie.numeros).length > 0) {
    Object.keys(voie.numeros).forEach(numeroIdx => {
      const numero = voie.numeros[numeroIdx]
      const positions = numero.edited ? numero.modified.positions : numero.positions

      if (positions.length > 0) {
        geojson.features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: positions[0].coords || positions[0].coordinates
          },
          properties: {
            ...numero,
            codeCommune,
            codeVoie: voie.codeVoie,
            source: positions[0].source,
            type: positions[0].type,
            lastUpdate: positions[0].dateMAJ
          }
        })
      }
    })
  } else {
    return null
  }

  return geojson.features.length > 0 ? geojson : null
}

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
    const voieAddresses = hasNumeros ? getVoieAddresses(commune.code, voie) : null
    const communeContour = commune.contour ? contoursToGeoJson([commune]) : null
    const bounds = voieAddresses || addresses || communeContour

    return (
      <div>
        <Head
          name={newName ? voie.modified.nomVoie : voie.nomVoie}
          status={getStatus(voie)}
          parent={commune.nom}
          previous={() => actions.select(commune.code)}
        />

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
            {addresses && addresses.features.length > 0 && (
              <Mapbox switchStyle>
                {map => (
                  <AddressesCommuneMap
                    map={map}
                    data={addresses}
                    bounds={bounds}
                    codeVoie={voie.codeVoie}
                    select={actions.select}
                  />
                )}
              </Mapbox>
            )}

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
