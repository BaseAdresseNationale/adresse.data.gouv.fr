import { getOnePartenairesDeLaCharte } from '@/lib/api-bal-admin'
import Section from '@/components/Section'
import Badge from '@codegouvfr/react-dsfr/Badge'
import { flattenDeep } from 'lodash'
import MoissonneurBal from '@/components/Partenaires/MoissonneurBAL'
import { getOrganization, getOrganizationSources } from '@/lib/api-moissonneur-bal'
import { OrganizationMoissoneurType, SourceMoissoneurType } from '@/types/api-moissonneur-bal.types'
import { PerimeterType } from '@/types/api-depot.types'
import Perimeters from '@/components/Partenaires/Perimeters'
import ResponsiveImage from '@/components/ResponsiveImage'
import PartenaireReviews from '@/components/PartenairesDeLaCharte/PartenaireReviews'

export default async function PartenairePage({ params }: { params: { id: string } }) {
  const partenaireDeLaCharte = await getOnePartenairesDeLaCharte(params.id)
  const moissonneur = {
    organizations: [] as OrganizationMoissoneurType[],
    sources: [] as SourceMoissoneurType[],
  }

  if (partenaireDeLaCharte.dataGouvOrganizationId && partenaireDeLaCharte.dataGouvOrganizationId.length > 0) {
    for (const orgaId of partenaireDeLaCharte.dataGouvOrganizationId) {
      moissonneur.organizations.push(await getOrganization(orgaId))
      moissonneur.sources.push(...(await getOrganizationSources(orgaId)))
    }
  }

  const { organizations, sources } = moissonneur

  const aggregatePerimeters: PerimeterType[] = flattenDeep(organizations.map(({ perimeters }) => perimeters) as any)

  return (
    <>
      <Section>
        <div className="fr-grid-row" style={{ flexWrap: 'nowrap', marginBottom: '2rem' }}>
          <ResponsiveImage style={{ maxWidth: 300, maxHeight: 300, marginRight: '1rem' }} src={partenaireDeLaCharte.picture} alt={`Logo de ${partenaireDeLaCharte.name}`} />
          <div>
            <h2>{partenaireDeLaCharte.name}</h2>
            {partenaireDeLaCharte.infos
            && <p>{partenaireDeLaCharte.infos}</p>}
          </div>
        </div>
        {partenaireDeLaCharte.services?.map(s => (
          <Badge style={{ marginRight: '1rem' }} key={s}>{s}</Badge>
        ))}
        {partenaireDeLaCharte.reviews && partenaireDeLaCharte.reviews.length > 0 && <PartenaireReviews reviews={partenaireDeLaCharte.reviews} />}
      </Section>
      {partenaireDeLaCharte.dataGouvOrganizationId
      && (
        <Section title="Publication de Bases Adresse Locale">
          <p>{partenaireDeLaCharte.name} mutualise la production et diffusion des Bases Adresses Locales (BAL).</p>
          <Perimeters perimeters={aggregatePerimeters} />
          <MoissonneurBal sources={sources} />
        </Section>
      )}
    </>
  )
}
