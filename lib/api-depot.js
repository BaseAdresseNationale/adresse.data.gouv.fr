import HttpError from './http-error'

const API_DEPOT_URL = process.env.NEXT_PUBLIC_API_DEPOT_URL || 'https://plateforme-bal.adresse.data.gouv.fr/api-depot'

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

  const response = await fetch(API_DEPOT_URL + url, options)
  const contentType = response.headers.get('content-type')

  if (!response.ok) {
    throw new HttpError(response)
  }

  if (contentType && contentType.includes('application/json')) {
    return response.json()
  }

  throw new Error('Une erreur est survenue')
}

export function getBalUrl(id) {
  return `${API_DEPOT_URL}/revisions/${id}/files/bal/download`
}

export async function getCurrentRevision(codeCommune) {
  try {
    const currentRevision = await _fetch(`/communes/${codeCommune}/current-revision`)
    return currentRevision
  } catch (error) {
    if (error.code === 404) {
      return
    }

    throw error
  }
}

export async function getRevisions(codeCommune) {
  return _fetch(`/communes/${codeCommune}/revisions`)
}
