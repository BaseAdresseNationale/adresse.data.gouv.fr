import dynamic from 'next/dynamic'
import FaEdit from 'react-icons/lib/fa/edit'
import Page from '../../layouts/main'

import Head from '../../components/head'
import Section from '../../components/section'
import LoadingContent from '../../components/loading-content'

const loadingStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%'
}

const title = 'Éditer une fichier base locale'
const description = 'Cet outil permet de réaliser de vérifier la conformité d’un fichier BAL et d’en éditer les champs.'

const Editor = dynamic(import('../../components/bases-locales/editor'), {
  loading: () => (
    <div style={loadingStyle}>
      <LoadingContent loading>
        Chargement…
          </LoadingContent>
    </div>
  ),
  ssr: false
})

export default () => (
  <Page>
    <Head title={title} icon={<FaEdit />}>
      {description}
    </Head>

    <Section>
      <Editor />
    </Section>
  </Page>
)
