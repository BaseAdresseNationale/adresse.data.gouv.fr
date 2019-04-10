import getConfig from 'next/config'

import {_get, _post} from '../fetch'

const {publicRuntimeConfig} = getConfig()

export const BACKEND_URL = publicRuntimeConfig.BACKEND_URL || 'https://backend.adresse.data.gouv.fr'

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
  const response = await _post(href, {url})

  return response
}

export async function getSubmissions(submissionId) {
  const href = `${BACKEND_URL}/publication/submissions/${submissionId}`
  const response = await _get(href)

  return response
}

export async function submitBal(submissionId) {
  const href = `${BACKEND_URL}/publication/submissions/${submissionId}/publish`
  const response = await _post(href, {})

  return response
}
