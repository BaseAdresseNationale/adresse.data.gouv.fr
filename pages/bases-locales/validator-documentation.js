import {UserCheck} from 'react-feather'

import Page from '@/layouts/main'
import Head from '@/components/head'
import ValidatorDocumentation from '@/components/bases-locales/validator/validateur-documentation'

const title = 'La Documentation du validateur BAL'

function ValidatorPage() {
  return (
    <Page>
      <Head title={title} icon={<UserCheck size={56} alt='' aria-hidden='true' />} />
      <ValidatorDocumentation />
    </Page>
  )
}

export default ValidatorPage
