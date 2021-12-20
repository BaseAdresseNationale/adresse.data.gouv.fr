const got = require('got')

function getApiDepotURL() {
  return process.env.NEXT_PUBLIC_API_DEPOT_URL || 'https://plateforme.adresse.data.gouv.fr/api-depot'
}

async function createHabilitation(req, res) {
  const {codeCommune} = req.params

  const data = await got.post(`${getApiDepotURL()}/communes/${codeCommune}/habilitations`, {
    headers: {
      authorization: `Token ${process.env.API_DEPOT_TOKEN}`,
    },
  }).json()

  res.send(data)
}

async function sendPinCode(req, res) {
  const {habilitationId} = req.params

  const data = await got.post(`${getApiDepotURL()}/habilitations/${habilitationId}/authentication/email/send-pin-code`, {
    headers: {
      authorization: `Token ${process.env.API_DEPOT_TOKEN}`,
    },
  }).json()

  res.send(data)
}

async function validatePinCode(req, res) {
  const {habilitationId, code} = req.params
  const data = await got.post(`${getApiDepotURL()}/habilitations/${habilitationId}/authentication/email/validate-pin-code`, {
    headers: {
      authorization: `Token ${process.env.API_DEPOT_TOKEN}`,
    },
    json: {code},
  }).json()

  res.send(data)
}

async function createRevision(req, res) {
  const {codeCommune} = req.params

  const response = await got.post(`${getApiDepotURL()}/communes/${codeCommune}/revisions`, {
    throwHttpErrors: false,
    responseType: 'json',
    headers: {
      authorization: `Token ${process.env.API_DEPOT_TOKEN}`,
    },
    json: req.body
  })

  res.send(response.body)
}

async function uploadFile(req, res) {
  const {revisionId} = req.params
  const pipe = req.pipe(got.put(`${getApiDepotURL()}/revisions/${revisionId}/files/bal`, {
    responseType: 'text',
    headers: {
      authorization: `Token ${process.env.API_DEPOT_TOKEN}`,
      ContentLength: req.get('Content-Length'),
      ContentMD5: req.get('Content-MD5'),
    }
  }))
    .on('error', error => {
      console.log('🚀 ~ error', error)
    })
    .on('end', () => {
      console.log('🚀 ~ end')
      const res2 = pipe.response
      res.send(res2)
    })
}

async function validateRevision(req, res) {
  const {revisionId} = req.params

  const data = await got.post(`${getApiDepotURL()}/revisions/${revisionId}/compute`, {
    throwHttpErrors: false,
    responseType: 'json',
    headers: {
      authorization: `Token ${process.env.API_DEPOT_TOKEN}`,
    }
  })

  res.send(data)
}

async function publishRevision(req, res) {
  const {revisionId} = req.params

  const data = await got.post(`${getApiDepotURL()}/revisions/${revisionId}/publish`, {
    headers: {
      authorization: `Token ${process.env.API_DEPOT_TOKEN}`,
    }
  }).json()

  res.send(data)
}

module.exports = {
  createHabilitation,
  sendPinCode,
  validatePinCode,
  createRevision,
  uploadFile,
  validateRevision,
  publishRevision
}
