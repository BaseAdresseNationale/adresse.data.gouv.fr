import FaFileTextO from 'react-icons/lib/fa/file-text-o'
import Page from '../../layouts/main'

import Head from '../../components/head'
import Section from '../../components/section'

import InitBase from '../../components/bases-locales/init-base'

const title = 'Initialiser une nouvelle base'
const description = 'Initialiser une nouvelle base à partir des données de la Base Adresse National.'

export default () => (
  <Page>
    <Head title={title} icon={<FaFileTextO />}>
      {description}
    </Head>

    <Section>
      <InitBase />
    </Section>
  </Page>
)
