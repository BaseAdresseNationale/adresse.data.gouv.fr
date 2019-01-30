import computeCentroid from '@turf/centroid'
import computeConcave from '@turf/concave'
import {randomColor} from 'randomcolor'
import {compact} from 'lodash'

import {getStatus} from './bal/item'

export function addressesToGeoJson(addresses) {
  const addrs = addresses.filter(address => address.position)

  return {
    type: 'FeatureCollection',
    features: addrs.map(address => {
      return {
        type: 'Feature',
        geometry: {
          type: address.position.type,
          coordinates: address.position.coordinates || address.position.coords
        },
        properties: {
          id: address.id,
          idVoie: address.idVoie,
          numero: address.numero,
          sources: address.sources,
          destination: address.destination ? address.destination[0] : null
        }
      }
    })
  }
}

export function voieNumerosToGeoJson(numeros) {
  const numerosWithPos = numeros.filter(numero => numero.positions.length > 0)

  return {
    type: 'FeatureCollection',
    features: numerosWithPos.map(numero => {
      const positions = numero.edited ? numero.modified.positions : numero.positions
      const position = positions[0]

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: position.coords || position.coordinates
        },
        properties: {
          ...numero
        }
      }
    })
  }
}

export function communeVoiesToGeoJson(commune) {
  const voies = Object.values(commune.voies)
  const filteredVoies = voies.filter(voie => voie.numeros)

  return {
    type: 'FeatureCollection',
    features: filteredVoies.map(voie => {
      const numeros = Object.values(voie.numeros)
      const numeroFeatures = voieNumerosToGeoJson(numeros).features
      const centroid = createCentroid(numeroFeatures)

      return {
        type: 'Feature',
        geometry: centroid.geometry,
        properties: {
          codeCommune: commune.code,
          codeVoie: voie.codeVoie,
          nomVoie: voie.modified && voie.modified.nomVoie ? voie.modified.nomVoie : voie.nomVoie,
          status: getStatus(voie),
          numerosCount: String(numeroFeatures.length)
        }
      }
    })
  }
}

export function communeNumerosToGeoJson(commune) {
  const geojson = {
    type: 'FeatureCollection',
    features: []
  }

  for (const voie of Object.values(commune.voies)) {
    if (voie.numeros) {
      for (const numero of Object.values(voie.numeros)) {
        const positions = numero.edited ? numero.modified.positions : numero.positions
        if (positions.length > 0) {
          geojson.features.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: positions[0].coords
            },
            properties: {
              ...numero,
              codeCommune: commune.code,
              codeVoie: voie.codeVoie,
              nomVoie: voie.nomVoie,
              source: positions[0].source,
              type: positions[0].type,
              status: getStatus(numero),
              voieStatus: getStatus(voie),
              lastUpdate: positions[0].dateMAJ,
              color: randomColor({luminosity: 'dark'})
            }
          })
        }
      }
    }
  }

  return geojson.features.length > 0 ? geojson : null
}

export function addressToGeoJson(address) {
  const entries = address.entries.filter(entry => entry.position)

  return {
    type: 'FeatureCollection',
    features: entries.map(entry => {
      return {
        type: 'Feature',
        geometry: {
          type: entry.position.type,
          coordinates: entry.position.coordinates
        },
        properties: {
          id: address.id,
          idVoie: address.idVoie,
          numero: address.numero,
          source: entry.source,
          destination: address.destination ? address.destination[0] : null
        }
      }
    })
  }
}

export function positionsToGeoJson(positions) {
  return {
    type: 'FeatureCollection',
    features: positions.map(position => {
      return {
        id: position._id,
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: position.coords || position.geometry.coordinates
        },
        properties: {
          type: position.type
        }
      }
    })
  }
}

export function numerosToGeoJson(numeros) {
  const numbers = numeros.filter(numero => numero.positions.length > 0)
  const positions = []

  numbers.map(numero => {
    numero.positions.map(position => {
      if (position.coords.length === 2) {
        positions.push({numero, position})
      }
      return null
    })
    return null
  })

  return {
    type: 'FeatureCollection',
    features: positions.map(pos => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: pos.position.coords
        },
        properties: {
          id: pos.numero.id,
          numero: pos.numero.numeroComplet,
          source: pos.position.source,
          type: pos.position.type,
          lastUpdate: pos.position.dateMAJ
        }
      }
    })
  }
}

export function contoursToGeoJson(communes) {
  const entries = communes.filter(commune => commune.contour)

  return {
    type: 'FeatureCollection',
    features: entries.map(commune => {
      const {contour} = commune

      return {
        id: commune.code,
        type: 'Feature',
        geometry: {
          type: contour.type,
          coordinates: contour.coordinates
        },
        properties: {
          code: commune.code,
          nom: commune.nom
        }
      }
    })
  }
}

export function coordinatesToGeoJson(coordinates) {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates
    }
  }
}

export function createCentroid(features) {
  const points = {
    type: 'FeatureCollection',
    features
  }

  return computeCentroid(points)
}

export function createConcave(features) {
  const points = {
    type: 'FeatureCollection',
    features
  }

  return computeConcave(points)
}

export function getConcaveVoie(voies) {
  const numerosVoies = Object.keys(voies).map(voie => {
    let result = null
    const numeroFeatures = Object.values(voies[voie])

    if (numeroFeatures.length >= 3) {
      result = createConcave(numeroFeatures)
    }

    if (result) {
      result.properties = {
        id: voie,
        coordinates: createCentroid(numeroFeatures).geometry.coordinates,
        numerosCount: String(numeroFeatures.length),
        codeCommune: numeroFeatures[0].properties.codeCommune,
        codeVoie: numeroFeatures[0].properties.codeVoie,
        voieName: numeroFeatures[0].properties.nomVoie
      }
    }

    return result
  })

  return {
    type: 'FeatureCollection',
    features: compact(numerosVoies)
  }
}

export default {
  addressesToGeoJson,
  addressToGeoJson,
  contoursToGeoJson,
  createCentroid,
  createConcave,
  getConcaveVoie
}
