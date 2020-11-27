import randomColor from 'randomcolor'

import theme from '../styles/theme'

import {hasPosition, getNumeroPosition} from './bal/item'

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

function numeroToFeature(numero) {
  const position = getNumeroPosition(numero)
  const {type} = position

  const coords = getCoordinates(position)
  const properties = {
    ...numero,
    color: numero.idVoie ? randomColor({
      luminosity: 'dark',
      seed: numero.idVoie
    }) : theme.primary,
    type
  }

  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: coords
    },
    properties
  }
}

export function positionToponymeToFeatureCollection(position) {
  const {coords, ...props} = position
  return {
    type: 'FeatureCollection', features: [{
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: coords
      },
      properties: {
        ...props,
        isToponyme: true
      }
    }]}
}

export function adresseToPositionsGeoJson(adresse) {
  const collection = adresse.entries || adresse.adressesOriginales || []
  const adressePositions = collection.filter(entry => entry.position)

  return {
    type: 'FeatureCollection',
    features: adressePositions.map(entry => numeroToFeature(entry))
  }
}

export function addressesToGeoJson(addresses) {
  const addrs = addresses.filter(address => address.position)

  return {
    type: 'FeatureCollection',
    features: addrs.map(address => numeroToFeature(address))
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
