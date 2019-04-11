import 'isomorphic-unfetch' // eslint-disable-line import/no-unassigned-import

import getConfig from 'next/config'

import HttpError from '../http-error'

const {publicRuntimeConfig: {
  API_EXPLORE_URL,
  API_EXPLORE_SEARCH_URL
}} = getConfig()

export async function _fetch(url) {
  const options = {
    headers: {
      Accept: 'application/json'
    },
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
