export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend.adresse.data.gouv.fr'
export const BAL_API_URL = process.env.NEXT_PUBLIC_BAL_API_URL || 'https://api-bal.adresse.data.gouv.fr/v1'

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

export async function getDatasets(options = {}) {
  const queryOptions = []

  if (options.sample) {
    queryOptions.push(`sample=${options.sample}`)
  }

  if (options.noContour) {
    queryOptions.push('noContour=1')
  }

  return _fetch(`${BACKEND_URL}/datasets?${queryOptions.join('&')}`, 'GET')
}

export async function getDataset(id) {
  const url = `${BACKEND_URL}/datasets/${id}`
  return _fetch(url, 'GET')
}

export async function getReport(id) {
  const url = `${BACKEND_URL}/datasets/${id}/report`
  return _fetch(url, 'GET')
}

export async function listBALByCodeDepartement(codeDepartement) {
  return _fetch(`${BAL_API_URL}/stats/departements/${codeDepartement}`)
}
