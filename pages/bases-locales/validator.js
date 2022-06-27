import {UserCheck} from 'react-feather'

import Page from '@/layouts/main'
import Head from '@/components/head'
import Validator from '@/components/bases-locales/validator'

const title = 'Le validateur BAL'

function ValidatorPage() {
  return (
    <Page>
      <Head title={title} icon={<UserCheck size={56} alt='' />} />
      <Validator />
    </Page>
  )
}

export default ValidatorPage
