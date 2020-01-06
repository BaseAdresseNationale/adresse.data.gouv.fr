import 'isomorphic-unfetch' // eslint-disable-line import/no-unassigned-import
import getConfig from 'next/config'

import HttpError from '../http-error'

const {publicRuntimeConfig} = getConfig()

export const API_EXPLORE_URL = publicRuntimeConfig.API_EXPLORE_URL || 'https://sandbox.geo.api.gouv.fr/explore'
export const API_EXPLORE_SEARCH_URL = publicRuntimeConfig.API_EXPLORE_SEARCH_URL || 'https://api-adresse.data.gouv.fr'

function checkIdVoie(idVoie) {
  return Boolean(idVoie.match(/^([a-z0-9]{5})_(([a-z0-9]{4})|([a-z0-9]{6}))$/i))
}

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

export function getVoie(idVoie) {
  const isValid = checkIdVoie(idVoie)
  return isValid ? _fetch(`${API_EXPLORE_URL}/${idVoie.replace('_', '/')}`) : null
}

export function getNumero(idVoie, numeroComplet) {
  const [, numero, suffixe] = numeroComplet.match(/^(\d+)(\w*)$/)
  const isValid = checkIdVoie(idVoie)

  return isValid ? _fetch(`${API_EXPLORE_URL}/${idVoie.replace('_', '/')}/${numero}${suffixe || ''}`) : null
}
