const {keyBy} = require('lodash')

const {getContourCommune, getCommunesStats} = require('./contours-communes')

function computeStats() {
  const {currentRevisions, communesSummary} = getCommunesStats()
  const currentRevisionsIndex = keyBy(currentRevisions, 'codeCommune')

  const otherPublishedCommunes = new Set(
    communesSummary
      .filter(c => c.typeComposition === 'bal')
      .map(c => c.codeCommune)
  )

  const communes = new Set([...currentRevisions.map(c => c.codeCommune), ...otherPublishedCommunes])

  return {
    type: 'FeatureCollection',
    features: [...communes]
      .filter(codeCommune => getContourCommune(codeCommune))
      .map(codeCommune => {
        const revisions = currentRevisionsIndex[codeCommune]
        const contourCommune = getContourCommune(codeCommune)
        const {nom, code, departement} = contourCommune.properties

        return {
          type: 'Feature',
          properties: {
            nom,
            code,
            departement,
            idClient: revisions ? revisions.client.id : null,
            nomClient: revisions ? revisions.client.nom : 'Moissonneur'
          },
          geometry: contourCommune.geometry
        }
      })
  }
}

module.exports = {
  computeStats
}
