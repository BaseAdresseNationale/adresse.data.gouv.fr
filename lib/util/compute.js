const {keyBy} = require('lodash')

const {getContourCommune, getCommunesStats} = require('./contours-communes')

function spaceThousands(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function getPercentage(value, totalValue) {
  const percentage = (value * 100) / totalValue
  const roundedPercentage = Math.floor(percentage * 10) / 10
  return (roundedPercentage ? String(roundedPercentage).replace('.', ',') : roundedPercentage) || 0
}

function computeStats() {
  const {currentRevisions, communesSummary} = getCommunesStats()
  const currentRevisionsIndex = keyBy(currentRevisions, 'codeCommune')
  const communesSummaryIndex = keyBy(communesSummary, 'codeCommune')

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
        const summary = communesSummaryIndex[codeCommune]
        const contourCommune = getContourCommune(codeCommune)
        const {nom, code} = contourCommune.properties
        const nbNumeros = spaceThousands(summary.nbNumeros)
        const certificationPercentage = getPercentage(summary.nbNumerosCertifies, summary.nbNumeros)

        return {
          type: 'Feature',
          properties: {
            nom,
            code,
            nbNumeros,
            certificationPercentage,
            idClient: revisions ? revisions.client.id : 'moissonneur-bal',
            nomClient: revisions ? revisions.client.nom : 'Moissonneur BAL'
          },
          geometry: contourCommune.geometry
        }
      })
  }
}

module.exports = {
  computeStats
}
