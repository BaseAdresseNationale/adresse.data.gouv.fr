/* eslint-disable no-await-in-loop */
import PropTypes from 'prop-types'
import { Users } from 'react-feather'

import Page from '@/layouts/main'
import Head from '@/components/head'

import { getOnePartenairesDeLaCharte } from '@/lib/api-bal-admin'
import Partenaire from '@/components/bases-locales/charte/partenaires'
import { getOrganization, getOrganizationSources } from '@/lib/moissonneur-bal'

export default async function PartenairePage({ params }: { params: { id: string } }) {
  const partenaireDeLaCharte = await getOnePartenairesDeLaCharte(params.id)
  const moissonneur = {
    organizations: [],
    sources: [],
  }

  if (partenaireDeLaCharte.dataGouvOrganizationId?.length > 0) {
    for (const orgaId of partenaireDeLaCharte.dataGouvOrganizationId) {
      moissonneur.organizations.push(await getOrganization(orgaId))
      moissonneur.sources.push(...(await getOrganizationSources(orgaId)))
    }
  }

  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<Users size={56} alt="" aria-hidden="true" />} />
      <Partenaire partenaireDeLaCharte={partenaireDeLaCharte} moissonneur={moissonneur} />
    </Page>
  )
}
