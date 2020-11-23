import getConfig from 'next/config'

import HttpError from './http-error'

const {publicRuntimeConfig} = getConfig()
const API_ETABLISSEMENTS_PUBLIC = publicRuntimeConfig.API_ETABLISSEMENTS_PUBLIC || 'https://etablissements-publics.api.gouv.fr/v3'

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

export function getMairie(codeCommune) {
  const url = `${API_ETABLISSEMENTS_PUBLIC}/communes/${codeCommune}/mairie`
  return _fetch(url)
}
