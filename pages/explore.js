import FaSearch from 'react-icons/lib/fa/search'
import Page from '../layouts/main'

import Head from '../components/head'
import Explorer from '../components/explorer'

const title = 'Consulter'
const description = 'Consulter les adresses'

const Explore = () => {
  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<FaSearch />}>
        {description}
      </Head>

      <Explorer />
    </Page>
  )
}

export default Explore
