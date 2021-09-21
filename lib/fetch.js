import 'isomorphic-unfetch' // eslint-disable-line import/no-unassigned-import

import HttpError from './http-error'

export default async function _fetch(url, options) {
  if (!options) {
    options = {
      mode: 'cors',
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
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
