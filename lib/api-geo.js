import getConfig from 'next/config'

import HttpError from './http-error'

const {NEXT_PUBLIC_API_GEO_URL: API_GEO_URL} = getConfig().publicRuntimeConfig

if (!API_GEO_URL) {
  throw new Error('API_GEO_URL is not defined in the environment')
}

export function isCodeDepNaive(token) {
  if (['2A', '2B'].includes(token)) {
    return true
  }

  return token.match(/^\d{2,3}$/)
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

export function getCommunes(args) {
  const {q, departement, fields, limit, boost, type} = args
  const codeDepFilter = departement ? `&codeDepartement=${departement}` : ''
  const nom = departement ? q.split(' ').filter(t => !isCodeDepNaive(t)).join(' ') : q
  let url = `${API_GEO_URL}/communes?nom=${encodeURIComponent(nom)}${codeDepFilter}`

  if (fields) {
    url += `&fields=${fields.join(',')}`
  }

  if (limit) {
    url += `&limit=${limit}`
  }

  if (boost) {
    url += `&boost=${boost}`
  }

  if (type) {
    url += `&type=${type}`
  }

  return _fetch(url)
}

export function getCommune(codeCommune, fields) {
  const url = `${API_GEO_URL}/communes/${codeCommune}?${fields}`

  return _fetch(url)
}

export function getByCode(args) {
  const {postalCode, type} = args
  let url = `${API_GEO_URL}/communes?codePostal=${postalCode}`

  if (type) {
    url += `&${type}`
  }

  return _fetch(url)
}

export function getRegions() {
  return _fetch(`${API_GEO_URL}/regions`)
}

export function getDepartements(args) {
  let url = `${API_GEO_URL}/departements`
  const {zone} = args
  if (zone) {
    url = url + `?zone=${zone}`
  }
  return _fetch(url)
}

export function getDepartementsByRegion(code) {
  return _fetch(`${API_GEO_URL}/regions/${code}/departements`)
}

export function getDepartementByCode(code) {
  return _fetch(`${API_GEO_URL}/departements/${code}`)
}

export function getEpcis({q, limit, fields}) {
  const url = new URL(`${API_GEO_URL}/epcis`)

  if (q) {
    url.searchParams.append('nom', q)
  }

  if (fields) {
    url.searchParams.append('fields', fields.toString())
  }

  if (limit) {
    url.searchParams.append('limit', limit)
  }

  return _fetch(url.toString())
}

export function getEpciCommunes(epciCode) {
  return _fetch(`${API_GEO_URL}/epcis/${epciCode}/communes`)
}

export function getDepartementCommunes(code) {
  return _fetch(`${API_GEO_URL}/departements/${code}/communes`)
}
