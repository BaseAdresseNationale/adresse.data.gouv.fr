import HttpError from './http-error'

export const BAN_API_DEPOT = process.env.NEXT_PUBLIC_BAN_API_DEPOT || 'https://plateforme.adresse.data.gouv.fr/api-depot'

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

export async function getRevisions(codeCommune) {
  return _fetch(`${BAN_API_DEPOT}/communes/${codeCommune}/revisions`)
}

export async function getCurrentRevision(codeCommune) {
  return _fetch(`${BAN_API_DEPOT}/communes/${codeCommune}/current-revision`)
}

export function getCurrentBal(codeCommune) {
  return `${BAN_API_DEPOT}/communes/${codeCommune}/current-revision/files/bal/download`
}
