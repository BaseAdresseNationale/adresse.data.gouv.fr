const got = require('got')
const {keyBy} = require('lodash')

let communesIndex
let ready = false

async function getRemoteFeatures(url) {
  const response = await got(url, {responseType: 'json'})
  return response.body.features
}

async function prepareContoursCommunes() {
  console.log('Prepare contours communes…')

  const communesFeatures = await getRemoteFeatures('http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/2022/geojson/communes-100m.geojson')

  communesIndex = keyBy([...communesFeatures], f => f.properties.code)
  ready = true

  console.log('Dataset ready')
}

function getContourCommune(codeCommune) {
  if (!ready) {
    throw new Error('Dataset not ready')
  }

  return communesIndex[codeCommune]
}

module.exports = {
  prepareContoursCommunes,
  getContourCommune
}
