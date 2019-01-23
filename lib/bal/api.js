import getConfig from 'next/config'

const {publicRuntimeConfig} = getConfig()

export const API_BAL_URL = publicRuntimeConfig.API_BAL_URL || 'https://adresse.data.gouv.fr/api-bal'

export async function extractCommunes(communes) {
  const url = `${API_BAL_URL}/ban/extract?communes=${communes.map(c => c.code).join()}`

  try {
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
  } catch (err) {
    throw new Error(err)
  }
}
