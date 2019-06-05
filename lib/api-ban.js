import fetch from 'isomorphic-unfetch'
import getConfig from 'next/config'

import HttpError from './http-error'

const {publicRuntimeConfig: {
  API_BAN_URL
}} = getConfig()

export async function request(url) {
  const options = {
    mode: 'cors',
    method: 'GET'
  }

  const response = await fetch(`${API_BAN_URL}${url}`, options)

  if (!response.ok) {
    throw new HttpError(response)
  }

  if (response.ok) {
    return response.json()
  }

  throw new Error('Une erreur est survenue')
}

export function getDepartements() {
  return request('/compare/compare-france.geojson')
}

export function getDepartementCommunes(codeDepartement) {
  const url = `/compare/compare-${codeDepartement}.geojson`
  return request(url)
}
