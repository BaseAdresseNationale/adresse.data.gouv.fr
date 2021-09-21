import qs from 'querystring'
import getConfig from 'next/config'

const {publicRuntimeConfig} = getConfig()
const API_ADRESSE = publicRuntimeConfig.API_ADRESSE || 'https://api-adresse.data.gouv.fr'

export function search(args) {
  const url = `${API_ADRESSE}/search/?${qs.stringify(args)}`

  return {url}
}

export function reverse(coordinates) {
  const lng = coordinates[0]
  const lat = coordinates[1]
  const url = `${API_ADRESSE}/reverse/?lng=${lng}&lat=${lat}`

  return {url}
}

export function csv(requestBody) {
  const url = `${API_ADRESSE}/search/csv/`
  const options = {method: 'POST', body: requestBody}

  return {url, options}
}
