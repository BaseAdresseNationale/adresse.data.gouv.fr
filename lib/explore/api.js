import 'isomorphic-unfetch' // eslint-disable-line import/no-unassigned-import
import getConfig from 'next/config'

import HttpError from '../http-error'

const {publicRuntimeConfig} = getConfig()

export const API_EXPLORE_URL = publicRuntimeConfig.API_EXPLORE_URL || 'https://sandbox.geo.api.gouv.fr/explore-next'
export const API_EXPLORE_SEARCH_URL = publicRuntimeConfig.API_EXPLORE_SEARCH_URL || 'https://api-adresse.data.gouv.fr'

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
  return _fetch(`${API_EXPLORE_URL}/${idVoie.replace('_', '/')}`)
}

export function getNumero(idVoie, numeroComplet) {
  const [, numero, suffixe] = numeroComplet.match(/^(\d+)(\w*)$/)
  return _fetch(`${API_EXPLORE_URL}/${idVoie.replace('_', '/')}/${numero}/${suffixe}`)
}

// Mocks the future API's response
import {round, reduce, flattenDeep, countBy, flow} from 'lodash' // eslint-disable-line import/order
import {getCommune as getCommuneInfos} from '../api-geo'
export async function getCommuneStats(codeCommune) {
  const {population} = await getCommuneInfos(codeCommune)
  const {voies} = await getCommune(codeCommune)

  const addresses = reduce(voies, (sum, voie) => sum + voie.numeros, 0)

  function getCount(items) {
    return flow(
      flattenDeep,
      countBy
    )(items)
  }

  const communeSources = voies.map(voie => voie.sources)
  const communeDestinations = voies.map(voie => voie.destination)

  const sources = getCount(communeSources)

  return {
    sources: Object.keys(sources).length === 0 || Object.keys(sources).includes('bal') ? null : sources,
    destinations: communeDestinations.length === 0 ? null : getCount(communeDestinations),
    citizensPerAddress: population && addresses ? round(population / addresses, 2) : null
  }
}
