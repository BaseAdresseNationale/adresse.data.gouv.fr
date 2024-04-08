import getConfig from 'next/config'

import {isCOM} from '@/lib/ban'

import HttpError from './http-error'

const {NEXT_PUBLIC_API_ETABLISSEMENTS_PUBLIC: API_ETABLISSEMENTS_PUBLIC} = getConfig().publicRuntimeConfig

if (!API_ETABLISSEMENTS_PUBLIC) {
  throw new Error('API_ETABLISSEMENTS_PUBLIC is not defined in the environment')
}

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
