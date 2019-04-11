import getConfig from 'next/config'

import HttpError from '../http-error'

const {publicRuntimeConfig} = getConfig()

export const BACKEND_URL = publicRuntimeConfig.BACKEND_URL || 'https://backend.adresse.data.gouv.fr'

async function _fetch(url, method, body) {
  const options = {
    headers: {
      Accept: 'application/json',
      'content-type': 'application/json'
    },
    mode: 'cors',
    method,
    body: body ? JSON.stringify(body) : null
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

export async function extractCommunes(communes) {
  const url = `${BACKEND_URL}/ban/extract?communes=${communes.map(c => c.code).join()}`
  const options = {
    headers: {
      Accept: 'text/csv',
      'Access-Control-Request-Headers': 'Content-Type, Content-Disposition'
    },
    mode: 'cors',
    method: 'GET'
  }

  const response = await fetch(url, options)
  const blob = await response.blob()
  return blob
}

export async function submissionsBal(url) {
  const href = `${BACKEND_URL}/publication/submissions`
  const response = await _fetch(href, 'POST', {url})

  return response
}

export async function getSubmissions(submissionId) {
  const href = `${BACKEND_URL}/publication/submissions/${submissionId}`
  const response = await _fetch(href, 'GET')

  return response
}

export async function submitBal(submissionId) {
  const href = `${BACKEND_URL}/publication/submissions/${submissionId}/publish`
  const response = await _fetch(href, 'POST', {})

  return response
}
