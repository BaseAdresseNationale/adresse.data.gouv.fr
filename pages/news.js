import FaNewspaperO from 'react-icons/lib/fa/newspaper-o'
import Page from '../layouts/main'

import Head from '../components/head'
import News from '../components/news'

const title = 'Actualités'
const description = 'Les événements, actualités autour des données et des services liés à l’Adresse.'

export default () => (
  <Page>
    <Head title={title} icon={<FaNewspaperO />}>
      {description}
    </Head>
    <News />
  </Page>
)
