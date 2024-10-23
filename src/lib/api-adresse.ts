interface ExtendedError extends Error {
  code?: number
  url?: string
  httpCode?: number
}

class HttpError extends (Error as { new(message: string): ExtendedError }) {
  constructor(response: Response) {
    super(response.statusText)

    this.name = 'HttpError'
    this.code = response.status
    this.url = response.url
  }
}

const API_ADRESSE = process.env.NEXT_PUBLIC_API_ADRESSE

if (!API_ADRESSE) {
  throw new Error('API_ADRESSE is not defined in the environment variables')
}

// TODO : Use customFetch ?
async function _fetch(url: string, _options: RequestInit = {}) {
  const options: RequestInit = {
    mode: 'cors',
    method: 'GET',
    ..._options,
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

export function isFirstCharValid(entry: string) {
  return (
    entry.slice(0, 1).toLowerCase() !== entry.slice(0, 1).toUpperCase())
    || (
      entry.codePointAt(0)
      && (
        Number(entry.codePointAt(0)) >= 48
        && Number(entry.codePointAt(0)) <= 57
      )
    )
}

export function search(args: Record<string, any>, signal: AbortSignal) {
  const { q, limit, lon, lng, lat, type, postcode, citycode, autocomplete = 1 } = args

  const params = new URLSearchParams(Object.fromEntries(Object.entries({
    q,
    limit,
    lon: lat && (lon || lng),
    lat: (lon || lng) && lat,
    type: type && encodeURIComponent(type),
    postcode: postcode && encodeURIComponent(postcode),
    citycode: citycode && encodeURIComponent(citycode),
    autocomplete: Number(autocomplete),
  }).filter(([, value]) => value))).toString()

  const url = `${API_ADRESSE}/search/?${params}`

  return _fetch(url, { signal })
}

export function reverse(coordinates: [number, number]) {
  const lng = coordinates[0]
  const lat = coordinates[1]
  const url = `${API_ADRESSE}/reverse/?lng=${lng}&lat=${lat}`

  return _fetch(url)
}

export async function geocodeCsv(
  inputFile: File,
  filters: { name: string, value: string }[],
  columns: string[],
) {
  class GeocodeError extends (Error as { new(message: string): ExtendedError }) {
    constructor(status: number, message: string) {
      super(message)
      this.httpCode = status
    }
  }

  // Build request
  const requestBody = new FormData()
  columns.forEach(c => requestBody.append('columns', c))
  filters.forEach(f => requestBody.append(f.name, f.value))
  requestBody.append('data', inputFile)

  // Execute request + handle response
  const response = await fetch(`${API_ADRESSE}/search/csv/`, { method: 'POST', body: requestBody })

  if (response.ok) {
    return response.blob()
  }

  // TODO : Use custom error
  switch (response.status) {
    case 400:
      throw new GeocodeError(response.status, 'Une erreur dans le formatage des données rend l’opération impossible. Veuillez vous rapprocher de notre équipe avec un échantillon minimal qui reproduit le problème.')
    case 502:
    case 503:
      throw new GeocodeError(response.status, 'Le service est actuellement surchargé. Merci de réessayer dans quelques minutes')
    default:
      throw new GeocodeError(response.status, 'Une erreur inconnue est survenue. N’hésitez pas à réessayer ultérieurement et à revenir vers nous le cas échéant.')
  }
}
