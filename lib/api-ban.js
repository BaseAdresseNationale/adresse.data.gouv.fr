import qs from 'querystring'
import fetch from 'isomorphic-unfetch'
import getConfig from 'next/config'

const {publicRuntimeConfig: {
  API_GEO_URL
}} = getConfig()

async function request(url, options) {
  const res = await fetch(`${API_GEO_URL}${url}`, options)
  if (!res.ok) {
    throw new Error('Erreur inattendue')
  }

  return res.json()
}

async function _request(url, options) {
  const res = await fetch(url, options)
  if (!res.ok) {
    throw new Error('Erreur inattendue')
  }

  return res.json()
}

export async function getDepartements() {
  return _request('http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/latest/geojson/departements-100m.geojson')
}

export function getDepartementCommunes(codeDepartement, options = {}) {
  const url = `/departements/${codeDepartement}/communes?${qs.stringify(options)}`

  return request(url)
}

export function getCommune(code, options = {}) {
  return request(`/communes/${code}?${qs.stringify(options)}`)
}
