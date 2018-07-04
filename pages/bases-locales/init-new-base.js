import FaFileTextO from 'react-icons/lib/fa/file-text-o'
import Page from '../../layouts/main'

import Head from '../../components/head'
import Section from '../../components/section'

import InitBase from '../../components/bases-locales/init-base'

const title = 'Initialiser une nouvelle base locale'
const description = 'Cet outil permet de réaliser une extraction automatisée de la Base Adresse Nationale au format BAL.'

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
