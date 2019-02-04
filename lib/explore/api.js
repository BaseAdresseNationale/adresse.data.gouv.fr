import getConfig from 'next/config'
import {_get} from '../fetch'

const {publicRuntimeConfig: {
  API_EXPLORE_URL,
  API_EXPLORE_SEARCH_URL
}} = getConfig()

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
