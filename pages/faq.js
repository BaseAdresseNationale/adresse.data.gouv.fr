import FaQuestion from 'react-icons/lib/fa/question'
import Page from '../layouts/main'

import Head from '../components/head'
import Faq from '../components/faq'

const title = 'Foire aux questions'
const description = 'Questions les plus fréquemment posées.'

export default () => (
  <Page>
    <Head title={title} icon={<FaQuestion />}>
      {description}
    </Head>
    <Faq />
  </Page>
)
