import getConfig from 'next/config'

import HttpError from './http-error'

const {publicRuntimeConfig: {
  API_ADRESSE
}} = getConfig()

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

export function csv(requestBody) {
  const url = `${API_ADRESSE}/search/csv/`
  return fetch(url, {method: 'POST', body: requestBody})
}
