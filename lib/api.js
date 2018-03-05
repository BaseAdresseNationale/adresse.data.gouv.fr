const options = {
  headers: {
    Accept: 'application/json'
  },
  mode: 'cors',
  method: 'GET'
}

async function api(baseUrl, query) {
  const url = baseUrl + query
  const response = await fetch(url, options)
  const contentType = response.headers.get('content-type')

  if (response.ok && contentType && contentType.includes('application/json')) {
    return response.json()
  }
  throw new Error('Une erreur est survenue')
}

export default api
