const NEXT_PUBLIC_ADRESSE_URL = process.env.NEXT_PUBLIC_ADRESSE_URL || 'http://localhost:3000'
const PROXY_API_DEPOT_URL = NEXT_PUBLIC_ADRESSE_URL + '/proxy-api-depot'

async function _fetch(url, method, body) {
  const options = {
    method
  }

  if (method === 'POST') {
    options.headers = {'Content-Type': 'application/json'}
    if (body) {
      options.body = JSON.stringify(body)
    }
  }

  const response = await fetch(`${PROXY_API_DEPOT_URL}${url}`, options)
  const contentType = response.headers.get('content-type')

  if (!response.ok) {
    throw new Error(response.message)
  }

  if (response.ok && contentType && contentType.includes('application/json')) {
    return response.json()
  }

  throw new Error('Une erreur est survenue')
}

async function uploadFile(revisionId, file) {
  try {
    return fetch(`${PROXY_API_DEPOT_URL}/revisions/${revisionId}/files/bal`, {
      method: 'PUT',
      headers: {'Content-Type': 'text/csv'},
      body: file
    })
  } catch (error) {
    throw new Error(`Impossible de téléverser le fichier : ${error}`)
  }
}

async function computeRevision(revisionId) {
  return _fetch(`/revisions/${revisionId}/compute`, 'POST')
}

export async function publishRevision(revisionId, body) {
  return _fetch(`/revisions/${revisionId}/publish`, 'POST', body)
}

export async function sendAuthenticationCode(habilitationId) {
  return _fetch(`/habilitations/${habilitationId}/authentication/email/send-pin-code`, 'POST')
}

export async function submitAuthentificationCode(habilitationId, code) {
  return _fetch(`/habilitations/${habilitationId}/authentication/email/validate-pin-code`, 'POST', {code})
}

export async function createRevision(codeCommune, file) {
  const revision = await _fetch(`/communes/${codeCommune}/revisions`, 'POST')
  await uploadFile(revision._id, file)

  return computeRevision(revision._id)
}

export async function getRevision(revisionId) {
  return _fetch(`/revisions/${revisionId}`)
}

export async function getHabilitation(habilitationId) {
  return _fetch(`/habilitations/${habilitationId}`)
}

export async function createHabilitation(codeCommune) {
  return _fetch(`/communes/${codeCommune}/habilitations`, 'POST')
}
