import computeCentroid from '@turf/centroid'
import computeConcave from '@turf/concave'
import {compact} from 'lodash'

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

export function getNumerosByVoie(voies) {
  const numerosVoies = Object.keys(voies).map(voie => {
    const numeroFeatures = voies[voie].map(numero => numero)
    const voieFeature = createCentroid(numeroFeatures)

    voieFeature.properties = {
      ...numeroFeatures[0].properties,
      coordinates: voieFeature.geometry.coordinates,
      numerosCount: String(numeroFeatures.length)
    }

    return voieFeature
  })

  return {
    type: 'FeatureCollection',
    features: compact(numerosVoies)
  }
}

export function getConcaveVoie(voies) {
  const numerosVoies = Object.keys(voies).map(voie => {
    let result = null
    const numeroFeatures = voies[voie].map(numero => numero)

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
  getNumerosByVoie,
  getConcaveVoie
}
