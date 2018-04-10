import Page from '../../../layouts/main'

import MultiFetchRouterParam from '../../../components/multi-fetch-router-param'

import Voie from '../../../components/explorer/voie'

const title = 'Voie'
const description = 'Consulter les voies de cette commune'
const fields = 'fields=code,nom,codesPostaux,surface,population,centre,contour,departement,region'

const calls = [
  {
    name: 'commune',
    baseUrl: 'https://geo.api.gouv.fr',
    constructQuery: ({codeCommune}) => `/communes/${codeCommune}?${fields}&boost=population`
  },
  {
    name: 'voies',
    baseUrl: 'https://sandbox.geo.api.gouv.fr/explore',
    constructQuery: ({codeCommune}) => `/${codeCommune}`
  },
  {
    name: 'addresses',
    baseUrl: 'https://sandbox.geo.api.gouv.fr/explore',
    constructQuery: ({codeCommune, codeVoie}) => `/${codeCommune}/${codeVoie}`
  }
]

const Voies = () => {
  return (
    <Page title={title} description={description}>
      <MultiFetchRouterParam calls={calls}>
        <Voie />
      </MultiFetchRouterParam>
    </Page>
  )
}

export default Voies
