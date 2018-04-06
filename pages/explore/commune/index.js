import FaSearch from 'react-icons/lib/fa/search'
import Page from '../../../layouts/main'

import Head from '../../../components/head'
import FetchRouterParam from '../../../components/fetch-router-param'
import CommuneInfos from '../../../components/explorer/commune-infos'

const title = 'Consulter'
const description = 'Consulter les adresses'

const Commune = () => {
  const fields = 'fields=code,nom,codesPostaux,surface,population,centre,contour,departement,region'
  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<FaSearch />}>
        {description}
      </Head>

      <FetchRouterParam
        baseUrl='https://geo.api.gouv.fr'
        constructQuery={({codeCommune}) => `/communes/${codeCommune}?${fields}&boost=population`} >
        <CommuneInfos />
      </FetchRouterParam>
    </Page>
  )
}

export default Commune
