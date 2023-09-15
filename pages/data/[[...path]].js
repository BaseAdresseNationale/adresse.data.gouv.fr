import {Download} from 'react-feather'
import {useRouter} from 'next/router'

import withErrors from '@/components/hoc/with-errors'
import Head from '@/components/head'
import Section from '@/components/section'
import Page from '@/layouts/main'
import Data from '@/views/data'

const rootLink = {
  href: '/donnees-nationales',
  label: 'Données nationales',
}

function DataPage() {
  const router = useRouter()
  const {path = []} = router.query

  return (path ? (
    <Page title={`BAN OpenData : ${path.join('/')}`}>
      <Head
        title='Téléchargez les données de la BAN'
        icon={<Download size={56} alt='' aria-hidden='true' />}
      />
      <Section>
        <Data {...{root: rootLink, path}} />
      </Section>
    </Page>
  ) : null)
}

export default withErrors(DataPage)
