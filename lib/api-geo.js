import getConfig from 'next/config'

import HttpError from './http-error'

const {publicRuntimeConfig: {
  API_GEO_URL
}} = getConfig()

export async function _fetch(url) {
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

export function getCommunes(nom, codeDep, fields, limit) {
  const codeDepFilter = codeDep ? `&codeDepartement=${codeDep}` : ''
  const url = `${API_GEO_URL}/communes?nom=${nom}${codeDepFilter}&fields=${fields}&limit=${limit}`

  return _fetch(url)
}

export function getCommune(codeCommune, fields) {
  const url = `${API_GEO_URL}/communes/${codeCommune}?${fields}`

  return _fetch(url)
}
