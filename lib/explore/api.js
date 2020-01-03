import 'isomorphic-unfetch' // eslint-disable-line import/no-unassigned-import
import getConfig from 'next/config'

import HttpError from '../http-error'

const {publicRuntimeConfig} = getConfig()

export const API_EXPLORE_URL = publicRuntimeConfig.API_EXPLORE_URL || 'https://sandbox.geo.api.gouv.fr/explore-next'
export const API_EXPLORE_SEARCH_URL = publicRuntimeConfig.API_EXPLORE_SEARCH_URL || 'https://api-adresse.data.gouv.fr'

function formatIdVoie(idVoie) {
  const id = idVoie.replace('_', '/')
  return id.lenght > 0 ? id : null
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
  const id = formatIdVoie(idVoie)
  return id ? _fetch(`${API_EXPLORE_URL}/${id}`) : null
}

export function getNumero(idVoie, numeroComplet) {
  const [, numero, suffixe] = numeroComplet.match(/^(\d+)(\w*)$/)
  const id = formatIdVoie(idVoie)

  return id ? _fetch(`${API_EXPLORE_URL}/${idVoie.replace('_', '/')}/${numero}${suffixe || ''}`) : null
}
