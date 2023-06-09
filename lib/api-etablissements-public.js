import HttpError from './http-error'
import {isCOM} from '@/lib/ban'

const API_ETABLISSEMENTS_PUBLIC = process.env.NEXT_PUBLIC_API_ETABLISSEMENTS_PUBLIC || 'https://etablissements-publics.api.gouv.fr/v3'

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
  const type = isCOM(codeCommune) && 'mairie_com'
  const url = `${API_ETABLISSEMENTS_PUBLIC}/communes/${codeCommune}/${type ? type : 'mairie'}`

  return _fetch(url)
}
