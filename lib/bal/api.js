import 'isomorphic-unfetch' // eslint-disable-line import/no-unassigned-import
import getConfig from 'next/config'

import HttpError from '../http-error'

const {publicRuntimeConfig} = getConfig()

export const BACKEND_URL = publicRuntimeConfig.BACKEND_URL || 'http://localhost:3000/backend'

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

export async function getMandat(codeCommune) {
  const href = `${BACKEND_URL}/publication/mandat/${codeCommune}`

  try {
    const response = await fetch(href, {credentials: 'include'})
    if (response.ok) {
      return response.json()
    }
  } catch {

  }
}

export async function submitBal(submissionId) {
  const href = `${BACKEND_URL}/publication/submissions/${submissionId}/publish`
  const response = await _fetch(href, 'POST', {})

  return response
}

export async function getDatasets() {
  return _fetch(`${BACKEND_URL}/datasets`, 'GET')
}

export async function getDataset(id) {
  const url = `${BACKEND_URL}/datasets/${id}`
  return _fetch(url, 'GET')
}

export async function getSummary(id) {
  const url = `${BACKEND_URL}/datasets/${id}/data/summary`
  return _fetch(url, 'GET')
}

export async function getStats() {
  return _fetch(`${BACKEND_URL}/datasets/stats`, 'GET')
}

export async function getCommune(datasetId, codeCommune) {
  const url = `${BACKEND_URL}/datasets/${datasetId}/data/${codeCommune}`
  return _fetch(url, 'GET')
}

export async function getVoie(datasetId, codeCommune, codeVoie) {
  const url = `${BACKEND_URL}/datasets/${datasetId}/data/${codeCommune}/${codeVoie}`
  return _fetch(url, 'GET')
}

export async function getReport(id) {
  const url = `${BACKEND_URL}/datasets/${id}/report`
  return _fetch(url, 'GET')
}

