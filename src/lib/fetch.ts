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

export async function customFetch(url: string, customOptions: RequestInit = {}) {
  try {
    const options: RequestInit = {
      mode: 'cors',
      method: 'GET',
      ...customOptions,
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
  catch (error) {
    console.error(error)
  }

  return null
}
