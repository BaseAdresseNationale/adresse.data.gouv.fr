import piwikConnector from 'piwik-react-router'

const piwik = piwikConnector({
  url: 'https://stats.data.gouv.fr',
  siteId: '13'
})

piwik.push(['setDomains', ['*.adresse.data.gouv.fr']])

export default piwik
