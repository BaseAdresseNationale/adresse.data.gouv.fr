import Loader from '@/components/Loader'
import dynamic from 'next/dynamic'
import { getCommune } from '@/lib/api-geo'
import { getCommuneFlag } from '@/lib/api-wikidata'
import { getHabilitation, getRevision } from '@/lib/api-depot'
import { Habilitation, Revision } from '@/types/api-depot.types'
import { Commune } from '@/types/api-geo.types'

const DynamicComponentWithNoSSR = dynamic<{ initialCommune?: Commune & { flagUrl: string }, initialRevision?: Revision, initialHabilitation?: Habilitation }>(
  () => import('../../../components/FormulaireDePublication'),
  { ssr: false, loading: () => <div style={{ display: 'flex', width: '100%', justifyContent: 'center', height: '400px', alignItems: 'center' }}><Loader size={50} /></div> }
)

interface FormulaireDePublicationPageProps {
  searchParams: { habilitationId?: string, revisionId?: string }
}

export default async function FormulaireDePublicationPage(props: FormulaireDePublicationPageProps) {
  const { habilitationId, revisionId } = props.searchParams
  let habilitation
  let revision
  let commune

  if (revisionId) {
    revision = await getRevision(revisionId)

    commune = await getCommune(revision.codeCommune)
    const communeFlagUrl = await getCommuneFlag(revision.codeCommune) || '/commune/default-logo.svg'
    commune = { ...commune, flagUrl: communeFlagUrl }
  }

  if (habilitationId) {
    habilitation = await getHabilitation(habilitationId, { useProxy: false })
  }

  // This page is a dynamic import of the FormulaireDePublication component
  // because pre-rendering fails when importing package @ban-team/validateur-bal
  return <DynamicComponentWithNoSSR initialCommune={commune} initialRevision={revision} initialHabilitation={habilitation} />
}
