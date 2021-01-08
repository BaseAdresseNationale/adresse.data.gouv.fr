import HttpError from '../http-error'

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend.adresse.data.gouv.fr'

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

export async function askAuthentificationCode(submissionId) {
  const href = `${BACKEND_URL}/publication/submissions/${submissionId}/send-pin-code`
  const options = {
    method: 'POST',
    mode: 'cors',
    headers: {'Content-Type': 'application/json'}
  }

  return fetch(href, options)
}

export async function submitAuthentificationCode(submissionId, code) {
  const href = `${BACKEND_URL}/publication/submissions/${submissionId}/validate-pin-code`
  const response = await _fetch(href, 'POST', {code})

  return response
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

