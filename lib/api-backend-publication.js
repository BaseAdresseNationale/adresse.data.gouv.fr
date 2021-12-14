const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend.adresse.data.gouv.fr'

async function _fetch(url, method, body) {
  const options = {
    method,
    mode: 'cors'
  }

  if (method === 'POST') {
    options.headers = {'Content-Type': 'application/json'}
    if (body) {
      options.body = JSON.stringify(body)
    }
  }

  const response = await fetch(url, options)
  const contentType = response.headers.get('content-type')

  if (!response.ok) {
    const {message} = await response.json()
    throw new Error(message)
  }

  if (response.ok && contentType && contentType.includes('application/json')) {
    return response.json()
  }

  throw new Error('Une erreur est survenue')
}

export async function uploadCSV(file) {
  const href = `${BACKEND_URL}/publication/submissions/upload`
  const options = {
    method: 'POST',
    mode: 'cors',
    headers: {'Content-Type': 'text/csv'},
    body: file
  }
  const response = await fetch(href, options)

  if (!response.ok) {
    const {message} = await response.json()
    throw new Error(message)
  }

  if (response.ok) {
    return response.json()
  }

  throw new Error('Impossible d’envoyer le fichier CSV, veuillez réessayer ultérieurement.')
}

export async function getSubmissions(submissionId) {
  const href = `${BACKEND_URL}/publication/submissions/${submissionId}`
  const response = await _fetch(href, 'GET')

  return response
}

export async function askAuthentificationCode(submissionId) {
  const href = `${BACKEND_URL}/publication/submissions/${submissionId}/send-pin-code`
  const options = {
    method: 'POST',
    mode: 'cors',
    headers: {'Content-Type': 'application/json'}
  }

  return fetch(href, options)
}

export async function submitAuthentificationCode(submissionId, code) {
  const href = `${BACKEND_URL}/publication/submissions/${submissionId}/validate-pin-code`
  const response = await _fetch(href, 'POST', {code})

  return response
}

export async function submitBal(submissionId) {
  const href = `${BACKEND_URL}/publication/submissions/${submissionId}/publish`
  const response = await _fetch(href, 'POST', {})

  return response
}

