const BASE_URL = 'https://base-adresse-locale-prod-blasons-communes.s3.fr-par.scw.cloud'

const DEFAULT_URL_DISTRICT_FLAG = '/commune/default-logo.svg'

// Fetch the commune flag from a proxy for front-end to avoid CORS issues
export const getCommuneFlagProxy = async (codeCommune: string): Promise<string> => {
  const response = await fetch(`/api/proxy-flag-commune/${codeCommune}`)

  return response.json()
}

export const getCommuneFlag = async (codeCommune: string): Promise<string> => {
  const url = `${BASE_URL}/${codeCommune}.svg`

  const response = await fetch(url, {
    method: 'HEAD',
  })

  if (!response.ok) {
    return DEFAULT_URL_DISTRICT_FLAG
  }

  return url
}
