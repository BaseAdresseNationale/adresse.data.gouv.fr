import 'isomorphic-unfetch' // eslint-disable-line import/no-unassigned-import
import getConfig from 'next/config'

import HttpError from './http-error'

const {publicRuntimeConfig} = getConfig()
const API_ADRESSE = publicRuntimeConfig.API_ADRESSE || 'https://api-adresse.data.gouv.fr'

async function _fetch(url) {
  const options = {
    mode: 'cors',
    method: 'GET'
  }

  const response = await fetch(url, options)
  const contentType = response.headers.get('content-type')

  if (!response.ok) {
    throw new HttpError(response)
  }

  if (response.ok && contentType && contentType.includes('application/json')) {
    return response.json()
  }

  throw new Error('Une erreur est survenue')
}

export function search(args) {
  const {q, lng, lat} = args
  let url = `${API_ADRESSE}/search/?q=${q}`

  if (lng && lat) {
    url += `&lng=${lng}&lat=${lat}`
  }

  return _fetch(url)
}

export function reverse(coordinates) {
  const lng = coordinates[0]
  const lat = coordinates[1]
  const url = `${API_ADRESSE}/reverse/?lng=${lng}&lat=${lat}`

  return _fetch(url)
}

export async function geocodeCsv(inputFile, filters, columns) {
  // Build request
  const requestBody = new FormData()
  columns.forEach(c => requestBody.append('columns', c))
  filters.forEach(f => requestBody.append(f.name, f.value))
  requestBody.append('data', inputFile)

  // Execute request + handle response
  const response = await fetch(`${API_ADRESSE}/search/csv/`, {method: 'POST', body: requestBody})

  if (response.ok) {
    return response.blob()
  }

  let error

  switch (response.status) {
    case 400:
      error = new Error('Une erreur dans le formatage des données rend l\'opération impossible. Veuillez vous rapprocher de notre équipe avec un échantillon minimal qui reproduit le problème.')
      error.httpCode = response.status
      throw error
    case 502:
    case 503:
      error = new Error('Le service est actuellement surchargé. Merci de réessayer dans quelques minutes')
      error.httpCode = response.status
      throw error
    default:
      error = new Error('Une erreur inconnue est survenue. N\'hésitez pas à réessayer ultérieurement et à revenir vers nous le cas échéant.')
      error.httpCode = response.status
      throw error
  }
}
