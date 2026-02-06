import { env } from 'next-runtime-env'

export async function getOrganizationName(siret: string): Promise<string | null> {
  const apiKey = env('INSEE_API_KEY_INTEGRATION')
  const apiUrl = env('INSEE_API_URL')

  if (!apiKey || !apiUrl) {
    return null
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000)

    const response = await fetch(`${apiUrl}/siret/${siret}`, {
      headers: {
        'X-INSEE-Api-Key-Integration': apiKey,
        'Accept': 'application/json',
      },
      signal: controller.signal,
      next: { revalidate: 3600 },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    const etablissement = data.etablissement
    const uniteLegale = etablissement?.uniteLegale

    if (uniteLegale?.denominationUniteLegale) {
      return uniteLegale.denominationUniteLegale
    }

    if (uniteLegale?.nomUniteLegale) {
      return `${uniteLegale.prenomUsuelUniteLegale || ''} ${uniteLegale.nomUniteLegale}`.trim()
    }

    return null
  }
  catch (error) {
    return null
  }
}
