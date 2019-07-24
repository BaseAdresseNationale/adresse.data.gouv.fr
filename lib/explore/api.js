import 'isomorphic-unfetch' // eslint-disable-line import/no-unassigned-import
import getConfig from 'next/config'

import HttpError from '../http-error'

const {publicRuntimeConfig} = getConfig()

export const API_EXPLORE_URL = publicRuntimeConfig.API_EXPLORE_URL || 'https://sandbox.geo.api.gouv.fr/explore'
export const API_EXPLORE_SEARCH_URL = publicRuntimeConfig.API_EXPLORE_SEARCH_URL || 'https://sandbox.geo.api.gouv.fr/explore-addok'

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

export function search(input) {
  return _fetch(`${API_EXPLORE_SEARCH_URL}/search?q=${encodeURIComponent(input)}`)
}

export function getNumerosBbox(codeCommune, bbox) {
  return _fetch(`${API_EXPLORE_URL}/${codeCommune}/numeros?bbox=${bbox}`)
}

export function getCommune(codeCommune) {
  return _fetch(`${API_EXPLORE_URL}/${codeCommune}`)
}

export function getVoie(codeCommune, codeVoie) {
  return _fetch(`${API_EXPLORE_URL}/${codeCommune}/${codeVoie}`)
}

export function getNumero(codeCommune, codeVoie, numero) {
  return _fetch(`${API_EXPLORE_URL}/${codeCommune}/${codeVoie}/${numero}`)
}
