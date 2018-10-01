import React from 'react'
import PropTypes from 'prop-types'

import getStatus from '../../../../../../lib/bal/item'
import Notification from '../../../../../notification'
import Button from '../../../../../button'

import {contoursToGeoJson} from '../../../../../../lib/geojson'

import Head from '../head'
import AdressesCommuneMap from '../adresses-commune-map'

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
      if (numero.positions.length > 0) {
        geojson.features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: numero.edited ? numero.modified.positions[0].coords : numero.positions[0].coords
          },
          properties: {
            ...numero,
            codeCommune,
            codeVoie: voie.codeVoie,
            source: numero.positions[0].source,
            type: numero.positions[0].type,
            lastUpdate: numero.positions[0].dateMAJ
          }
        })
      }
    })
  } else {
    return null
  }

  return geojson
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
              <AdressesCommuneMap
                data={addresses}
                bounds={voieAddresses}
                select={actions.select}
              />
            )}

            {hasNumeros ? (
              <NumerosList
                codeCommune={commune.code}
                codeVoie={voie.codeVoie}
                numeros={numeros}
                bounds={voieAddresses}
                actions={actions}
              />
            ) : (
              <EmptyNumeroList
                bounds={contoursToGeoJson([commune])}
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
