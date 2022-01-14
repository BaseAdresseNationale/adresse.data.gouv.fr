import HttpError from './http-error'

const API_GEO_URL = process.env.NEXT_PUBLIC_API_GEO_URL || 'https://geo.api.gouv.fr'

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
  const {q, departement, fields, limit, boost} = args
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

  return _fetch(url)
}

export function getCommune(codeCommune, fields) {
  const url = `${API_GEO_URL}/communes/${codeCommune}?${fields}`

  return _fetch(url)
}

export function getByCode({postalCode}) {
  const url = `${API_GEO_URL}/communes?codePostal=${postalCode}`

  return _fetch(url)
}

export function getDepartements() {
  return _fetch(`${API_GEO_URL}/departements`)
}

export function getDepartementByCode(code) {
  return _fetch(`${API_GEO_URL}/departements/${code}`)
}
