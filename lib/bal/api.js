export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend.adresse.data.gouv.fr'
export const BACKEND_URL_STATS = process.env.NEXT_PUBLIC_API_BAL_STATS_URL || 'https://plateforme.adresse.data.gouv.fr/ban/stats'

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
    const {message} = await response.json()
    throw new Error(message)
  }

  if (response.ok && contentType && contentType.includes('application/json')) {
    return response.json()
  }

  throw new Error('Une erreur est survenue')
}

export async function getDatasets() {
  return _fetch(`${BACKEND_URL}/datasets`, 'GET')
}

export async function getDataset(id) {
  const url = `${BACKEND_URL}/datasets/${id}`
  return _fetch(url, 'GET')
}

export async function getBALStats() {
  return _fetch(BACKEND_URL_STATS, 'GET')
}

export async function getReport(id) {
  const url = `${BACKEND_URL}/datasets/${id}/report`
  return _fetch(url, 'GET')
}

