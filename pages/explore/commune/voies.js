import FaRoad from 'react-icons/lib/fa/road'
import Page from '../../../layouts/main'

import Head from '../../../components/head'
import FetchRouterParam from '../../../components/fetch-router-param'
import Voie from '../../../components/explorer/voie'

const title = 'Voie'
const description = 'Consulter les voies de cette commune'

const Voies = () => {
  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<FaRoad />}>
        {description}
      </Head>

      <FetchRouterParam
        baseUrl='https://sandbox.geo.api.gouv.fr/explore'
        constructQuery={({codeCommune, codeVoie}) => `/${codeCommune}/${codeVoie}`} >
        <Voie />
      </FetchRouterParam>
    </Page>
  )
}

export default Voies
