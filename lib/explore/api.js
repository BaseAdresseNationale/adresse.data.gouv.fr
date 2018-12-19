import getConfig from 'next/config'
import {_get} from '../fetch'

const {publicRuntimeConfig} = getConfig()

const API_EXPLORE_URL = publicRuntimeConfig.API_EXPLORE_URL || 'https://sandbox.geo.api.gouv.fr/explore'

const API_EXPLORE_SEARCH_URL = publicRuntimeConfig.API_EXPLORE_SEARCH_URL || 'https://sandbox.geo.api.gouv.fr/explore-addok'

export function search(input) {
  return _get(`${API_EXPLORE_SEARCH_URL}/search?q=${encodeURIComponent(input)}`)
}

export function getNumerosBbox(codeCommune, bbox) {
  return _get(`${API_EXPLORE_URL}/${codeCommune}/numeros?bbox=${bbox}`)
}

export function getCommune(codeCommune) {
  return _get(`${API_EXPLORE_URL}/${codeCommune}`)
}

export function getVoie(codeCommune, codeVoie) {
  return _get(`${API_EXPLORE_URL}/${codeCommune}/${codeVoie}`)
}

export function getNumero(codeCommune, codeVoie, numero) {
  return _get(`${API_EXPLORE_URL}/${codeCommune}/${codeVoie}/${numero}`)
}
