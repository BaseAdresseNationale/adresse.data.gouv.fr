import HttpError from './http-error'

export const API_BAN_URL = process.env.NEXT_PUBLIC_API_BAN_URL || 'https://sandbox.geo.api.gouv.fr/explore'

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

export function getAddress(idAddress) {
  return _fetch(`${API_BAN_URL}/${idAddress}`)
}
