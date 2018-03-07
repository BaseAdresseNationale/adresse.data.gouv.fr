import FaSearch from 'react-icons/lib/fa/search'
import Page from '../../layouts/main'

import Head from '../../components/head'
import FetchRouterParam from '../../components/fetch-router-param'
import Explorer from '../../components/explorer'

const title = 'Consulter'
const description = 'Consulter les adresses'

const Explore = () => {
  const fields = 'fields=code,nom,codesPostaux,surface,population,centre,contour,departement,region'
  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<FaSearch />}>
        {description}
      </Head>

      <FetchRouterParam
        baseUrl='https://geo.api.gouv.fr'
        paramName='code'
        constructQuery={code => `/communes/${code}?${fields}&boost=population`} >
        <Explorer />
      </FetchRouterParam>
    </Page>
  )
}

export default Explore
