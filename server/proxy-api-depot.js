const express = require('express')
const got = require('../lib/util/got.js')
const {ironSession} = require('iron-session/express')

const w = require('./w')

const API_DEPOT_URL = process.env.NEXT_PUBLIC_API_DEPOT_URL || 'https://plateforme.adresse.data.gouv.fr/api-depot'
const {API_DEPOT_TOKEN} = process.env

const commonReqOptions = {
  prefixUrl: API_DEPOT_URL,
  headers: {
    authorization: `Token ${API_DEPOT_TOKEN}`
  },
  throwHttpErrors: false,
  responseType: 'json'
}

function forward(gotResponse, res) {
  res.status(gotResponse.statusCode).send(gotResponse.body)
}

async function addIdToSession(id, req) {
  if (req.session.knownIds) {
    req.session.knownIds.push(id)
  } else {
    req.session.knownIds = [id]
  }

  await req.session.save()
}

async function getHabilitation(req, res) {
  const {habilitationId} = req.params

  const response = await got.get(`habilitations/${habilitationId}`, commonReqOptions)
  forward(response, res)
}

async function createHabilitation(req, res) {
  const {codeCommune} = req.params

  const response = await got.post(`communes/${codeCommune}/habilitations`, commonReqOptions)

  if (response.statusCode === 201) {
    await addIdToSession(response.body._id, req)
  }

  forward(response, res)
}

async function sendPinCode(req, res) {
  const {habilitationId} = req.params

  const response = await got
    .post(`habilitations/${habilitationId}/authentication/email/send-pin-code`, commonReqOptions)

  forward(response, res)
}

async function validatePinCode(req, res) {
  const {habilitationId} = req.params

  const response = await got
    .post(`habilitations/${habilitationId}/authentication/email/validate-pin-code`, {...commonReqOptions, json: req.body})

  forward(response, res)
}

async function createRevision(req, res) {
  const {codeCommune} = req.params

  const response = await got.post(`communes/${codeCommune}/revisions`, {
    ...commonReqOptions, json: {context: {}}
  })

  if (response.statusCode === 201) {
    await addIdToSession(response.body._id, req)
  }

  forward(response, res)
}

async function getRevision(req, res) {
  const {revisionId} = req.params

  const response = await got.get(`revisions/${revisionId}`, commonReqOptions)
  forward(response, res)
}

async function uploadFile(req, res) {
  const {revisionId} = req.params

  const response = await got.put(`revisions/${revisionId}/files/bal`, {
    ...commonReqOptions,
    body: req.body,
    headers: {
      ...commonReqOptions.headers,
      'Content-Type': 'text/csv'
    }
  })

  forward(response, res)
}

async function computeRevision(req, res) {
  const {revisionId} = req.params
  const response = await got.post(`revisions/${revisionId}/compute`, commonReqOptions)
  forward(response, res)
}

async function publishRevision(req, res) {
  const {revisionId} = req.params
  const response = await got.post(`revisions/${revisionId}/publish`, {...commonReqOptions, json: req.body})
  forward(response, res)
}

const app = new express.Router()

app.use(express.json())
app.use(ironSession({
  cookieName: 'proxy-api-depot-session',
  ttl: 6 * 3600, // 6 heures
  password: process.env.SESSION_SECRET,
  cookieOptions: {
    path: '/proxy-api-depot'
  }
}))

app.use((req, res, next) => {
  const {habilitationId, revisionId} = req.params;

  [habilitationId, revisionId].filter(Boolean).forEach(id => {
    if (!req.session.knownIds || !req.session.knownIds.includes(id)) {
      return res.status(403).send({code: 403, message: 'Vous n’avez pas les droits nécessaires pour réaliser cette action.'})
    }
  })

  next()
})

// Habilitations
app.post('/communes/:codeCommune/habilitations', w(createHabilitation))
app.get('/habilitations/:habilitationId', w(getHabilitation))
app.post('/habilitations/:habilitationId/authentication/email/send-pin-code', w(sendPinCode))
app.post('/habilitations/:habilitationId/authentication/email/validate-pin-code', w(validatePinCode))

// Revisions
app.post('/communes/:codeCommune/revisions', w(createRevision))
app.get('/revisions/:revisionId', w(getRevision))
app.put(
  '/revisions/:revisionId/files/bal',
  express.raw({limit: '10mb', type: 'text/csv'}),
  w(uploadFile)
)
app.post('/revisions/:revisionId/compute', w(computeRevision))
app.post('/revisions/:revisionId/publish', w(publishRevision))

module.exports = app
