const got = require('got')
const {keyBy} = require('lodash')

const API_DEPOT_URL = process.env.NEXT_PUBLIC_API_DEPOT_URL || 'https://plateforme.adresse.data.gouv.fr/api-depot'
const API_BAN_URL = process.env.NEXT_PUBLIC_API_BAN_URL || 'https://plateforme.adresse.data.gouv.fr'

let communesIndex
let communes
let ready = false

async function getRemoteFeatures(url) {
  const response = await got(url, {responseType: 'json'})
  return response.body.features
}

async function getRemoteCommunesStats() {
  const currentRevisions = await got(`${API_DEPOT_URL}/current-revisions`, {responseType: 'json'})
  const communesSummary = await got(`${API_BAN_URL}/api/communes-summary`, {responseType: 'json'})

  return {
    currentRevisions: currentRevisions.body,
    communesSummary: communesSummary.body
  }
}

async function prepareContoursCommunes() {
  console.log('Prepare contours communes…')

  const communesFeatures = await getRemoteFeatures('http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/2022/geojson/communes-100m.geojson')
  const {currentRevisions, communesSummary} = await getRemoteCommunesStats()

  communesIndex = keyBy([...communesFeatures], f => f.properties.code)
  communes = {currentRevisions, communesSummary}
  ready = true

  console.log('Dataset ready')
}

function getContourCommune(codeCommune) {
  if (!ready) {
    throw new Error('Dataset not ready')
  }

  return communesIndex[codeCommune]
}

function getCommunesStats() {
  if (!ready) {
    throw new Error('Dataset not ready')
  }

  return communes
}

module.exports = {
  prepareContoursCommunes,
  getContourCommune,
  getCommunesStats
}
