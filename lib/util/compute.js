const got = require('got')
const {keyBy, groupBy} = require('lodash')
const getConfig = require('next/config')

const {getContourCommune} = require('./contours-communes')

const {
  NEXT_PUBLIC_API_DEPOT_URL: API_DEPOT_URL,
  NEXT_PUBLIC_API_BAN_URL: API_BAN_URL,
  NEXT_PUBLIC_BAL_API_URL: API_BAL_URL,
} = getConfig().publicRuntimeConfig

if (!API_BAN_URL) {
  throw new Error('API_BAN_URL is not defined in the environment')
}

if (!API_DEPOT_URL) {
  throw new Error('API_DEPOT_URL is not defined in the environment')
}

if (!API_BAL_URL) {
  throw new Error('API_BAL_URL is not defined in the environment')
}

function spaceThousands(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function getPercentage(value, totalValue) {
  const percentage = (value * 100) / totalValue
  const roundedPercentage = Math.floor(percentage * 10) / 10
  return (roundedPercentage ? String(roundedPercentage).replace('.', ',') : roundedPercentage) || 0
}

async function fetchStatsData() {
  const currentRevisions = await got(`${API_DEPOT_URL}/current-revisions`).json()
  const communesSummary = await got(`${API_BAN_URL}/api/communes-summary`).json()
  const bals = await got.post(`${API_BAL_URL}/stats/bals?fields=id&fields=commune&fields=status`).json()

  return {currentRevisions, communesSummary, bals}
}

function computeStatusBals(bals = []) {
  if (bals.map(b => b.status).includes('published')) {
    return 'published'
  }

  if (bals.map(b => b.status).includes('replaced')) {
    return 'replaced'
  }

  if (bals.map(b => b.status).includes('draft')) {
    return 'draft'
  }

  return 'unknown'
}

function createFeature(codeCommune, currentRevisionsIndex, communesSummaryIndex, communesBalsIndex) {
  const revisions = currentRevisionsIndex[codeCommune]
  const summary = communesSummaryIndex[codeCommune]
  const contourCommune = getContourCommune(codeCommune)
  const {nom, code} = contourCommune.properties
  const nbNumeros = spaceThousands(summary.nbNumeros)
  const certificationPercentage = getPercentage(summary.nbNumerosCertifies, summary.nbNumeros)
  const hasBAL = summary.typeComposition === 'bal'
  const statusBals = computeStatusBals(communesBalsIndex[codeCommune])

  const feature = {
    type: 'Feature',
    properties: {
      nom,
      code,
      nbNumeros,
      hasBAL,
      certificationPercentage,
      ...((hasBAL && revisions) ? {
        idClient: revisions.client.id || '',
        nomClient: revisions.client.nom || '',
      } : {}),
      statusBals,
    },
    geometry: contourCommune.geometry
  }

  return feature
}

function computeStats({currentRevisions, communesSummary, bals}, codesCommune) {
  const currentRevisionsIndex = keyBy(currentRevisions, 'codeCommune')
  const communesSummaryIndex = keyBy(communesSummary, 'codeCommune')
  const communesBalsIndex = groupBy(bals, 'commune')

  const communes = codesCommune?.length > 0 ? new Set(codesCommune) : new Set([...currentRevisions.map(c => c.codeCommune), ...communesSummary.map(c => c.codeCommune)])

  return {
    type: 'FeatureCollection',
    features: [...communes]
      .filter(codeCommune => communesSummaryIndex[codeCommune] && getContourCommune(codeCommune))
      .map(codeCommune => createFeature(codeCommune, currentRevisionsIndex, communesSummaryIndex, communesBalsIndex))
  }
}

module.exports = {
  computeStats,
  fetchStatsData
}
