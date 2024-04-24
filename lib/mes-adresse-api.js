import HttpError from './http-error'
import getConfig from 'next/config'

const {NEXT_PUBLIC_BAL_API_URL: API_MES_ADRESSES_URL} = getConfig().publicRuntimeConfig

async function _fetch(url, method, body) {
  const options = {
    method,
    mode: 'cors'
  }

  if (method === 'POST') {
    options.headers = {'Content-Type': 'application/json'}
    if (body) {
      options.body = JSON.stringify(body)
    }
  }

  const response = await fetch(API_MES_ADRESSES_URL + url, options)
  const contentType = response.headers.get('content-type')

  if (!response.ok) {
    throw new HttpError(response)
  }

  if (contentType && contentType.includes('application/json')) {
    return response.json()
  }

  throw new Error('Une erreur est survenue')
}

export async function getStatsBals(fields, codesCommunes) {
  const query = fields.map(field => `fields=${field}`)
  return _fetch('/stats/bals?' + query.join('&'), 'POST', codesCommunes)
}

export async function getBalsStatus() {
  return _fetch('/stats/bals/status', 'GET')
}
