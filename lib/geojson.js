import computeCentroid from '@turf/centroid'
import computeConcave from '@turf/concave'
import {point} from '@turf/helpers'
import {randomColor} from 'randomcolor'

import {getStatus, getName, hasPosition, getNumeroPos, getPosition} from './bal/item'

function getCoordinates(position) { // Converge /explore and BAL models
  const {coords, coordinates} = position
  return coords || coordinates
}

function communeContour(commune) {
  const {contour, code, nom} = commune
  return {
    id: code,
    type: 'Feature',
    geometry: contour,
    properties: {
      code,
      nom
    }
  }
}

function voieToFeature(voie) {
  const numeroFeatures = voieNumerosToGeoJson(voie).features
  const centroid = createCentroid(numeroFeatures)
  const properties = {
    ...voie,
    nomVoie: getName(voie),
    status: getStatus(voie),
    numerosCount: String(numeroFeatures.length)
  }

  return point(centroid.geometry.coordinates, properties)
}

function toponymeToFeature(toponyme) {
  const position = getPosition(toponyme)
  const coords = getCoordinates(position)
  const properties = {
    ...toponyme,
    color: randomColor({luminosity: 'dark', seed: toponyme.codeVoie})
  }

  return point(coords, properties)
}

function numeroToFeature(numero) {
  const position = getNumeroPos(numero)
  const {type} = position
  const coords = getCoordinates(position)
  const properties = {
    ...numero,
    type
  }

  return point(coords, properties)
}

function numeroPositionFeature(position) {
  const {type} = position
  const coords = getCoordinates(position)

  return point(coords, {type})
}

export function featureToPosition(feature) {
  return {
    _id: feature.id,
    coords: feature.geometry.coordinates,
    type: 'entrée',
    source: [],
    dateMAJ: null
  }
}

export function addressToGeoJson(address) {
  const entries = address.entries.filter(entry => entry.position)

  return {
    type: 'FeatureCollection',
    features: entries.map(entry => numeroToFeature(entry))
  }
}

export function addressesToGeoJson(addresses) {
  const addrs = addresses.filter(address => address.position)

  return {
    type: 'FeatureCollection',
    features: addrs.map(address => numeroToFeature(address))
  }
}

export function voieNumerosToGeoJson(voie) {
  const numerosWithPos = Object.values(voie.numeros).filter(hasPosition)

  return {
    type: 'FeatureCollection',
    features: numerosWithPos.map(numero => numeroToFeature(numero))
  }
}

export function communeVoiesToGeoJson(commune) {
  const voies = Object.values(commune.voies)
  const toponymes = voies.filter(voie => voie.position)
  const voieWithNumeros = voies.filter(voie => voie.numeros)
  const features = voieWithNumeros.map(voie => {
    const feature = voieToFeature(voie)
    feature.properties.codeCommune = commune.code
    feature.properties.codeVoie = voie.codeVoie

    return feature
  })

  toponymes.forEach(toponyme => {
    const feature = toponymeToFeature(toponyme)
    features.push(feature)
  })

  return {
    type: 'FeatureCollection',
    features
  }
}

export function communeNumerosToGeoJson(commune) {
  const geojson = {
    type: 'FeatureCollection',
    features: []
  }

  for (const voie of Object.values(commune.voies)) {
    if (voie.numeros) {
      const numerosWithPos = Object.values(voie.numeros).filter(hasPosition)
      numerosWithPos.forEach(numero => {
        const feature = numeroToFeature(numero)
        feature.properties.codeCommune = commune.code
        feature.properties.codeVoie = voie.codeVoie
        feature.properties.nomVoie = voie.nomVoie
        feature.properties.status = getStatus(numero)
        feature.properties.voieStatus = getStatus(voie)
        feature.properties.color = randomColor({luminosity: 'dark', seed: voie.codeVoie})

        geojson.features.push(feature)
      })
    }
  }

  return geojson.features.length > 0 ? geojson : null
}

export function toponymeToGeoJson(toponyme) {
  return {
    type: 'FeatureCollection',
    features: [toponymeToFeature(toponyme)]
  }
}

export function positionsToGeoJson(positions) {
  return {
    type: 'FeatureCollection',
    features: positions.map(position => numeroPositionFeature(position))
  }
}

export function numerosToGeoJson(numeros) {
  const numerosWithPos = numeros.filter(hasPosition)

  return {
    type: 'FeatureCollection',
    features: numerosWithPos.map(numero => numeroToFeature(numero))
  }
}

export function contoursToGeoJson(communes) {
  const communesWithCtr = communes.filter(commune => commune.contour)

  return {
    type: 'FeatureCollection',
    features: communesWithCtr.map(commune => communeContour(commune))
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
