import {PieChart} from 'react-feather'

import Page from '@/layouts/main'

import Head from '@/components/head'

function Indicateurs() {
  const title = 'Indicateurs d’impact'
  const description = ''

  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<PieChart size={56} alt='' aria-hidden='true' />} />

    </Page>
  )
}

export default Indicateurs

