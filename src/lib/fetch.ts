export default class HttpError extends Error {
  public code: number
  public url: string
  constructor(response: Response) {
    super(response.statusText)

    this.name = 'HttpError'
    this.code = response.status
    this.url = response.url
  }
}

export async function customFetch(url: string | URL | globalThis.Request, customOptions: RequestInit = {}) {
  const options: RequestInit = {
    mode: 'cors',
    method: 'GET',
    ...customOptions,
  }

  const response = await fetch(url, options)
  const contentType = response.headers.get('content-type')

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const message = body?.error || body?.message || response.statusText
    const err = new Error(message) as Error & { status: number }
    err.status = response.status
    throw err
  }

  if (response.ok && contentType && contentType.includes('application/json')) {
    return response.json()
  }

  void response.body?.cancel().catch(() => {})
}

export function addSearchParams(url: URL, queryObject: any) {
  Object.keys(queryObject).forEach((key) => {
    const value = queryObject[key]
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((value) => {
          url.searchParams.append(key, value)
        })
      }
      else {
        url.searchParams.append(key, value)
      }
    }
  })
}
