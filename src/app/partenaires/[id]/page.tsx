import { getOnePartenairesDeLaCharte } from '@/lib/api-bal-admin'
import Section from '@/components/Section'
import Badge from '@codegouvfr/react-dsfr/Badge'
import { flattenDeep } from 'lodash'
import { findCommuneName } from '@/utils/cog'
import MoissonneurBal from '@/components/Partenaires/MoissonneurBAL'
import { getOrganization, getOrganizationSources } from '@/lib/api-moissonneur-bal'
import { OrganizationMoissoneurType, SourceMoissoneurType } from '@/types/api-moissonneur-bal.types'
import { PerimeterType } from '@/types/api-depot.types'
import Perimeters from '@/components/Partenaires/Perimeters'

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
        <div className="fr-container fr-py-2w">
          <div className="fr-grid-row" style={{ flexWrap: 'nowrap' }}>
            <div>
              <div className="logo" style={{ backgroundImage: `url("${partenaireDeLaCharte.picture}")` }} />
            </div>
            <div>
              <h2>{partenaireDeLaCharte.name}</h2>
              {partenaireDeLaCharte.infos
              && <p>{partenaireDeLaCharte.infos}</p>}
            </div>
          </div>
        </div>
        <div className="fr-container fr-py-2w">
          {partenaireDeLaCharte.services
          && (
            <div style={{ margin: 'var(--text-spacing)' }}>
              {partenaireDeLaCharte.services?.map(s => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
          )}
        </div>
      </Section>
      {partenaireDeLaCharte.dataGouvOrganizationId && (
        <Section title="Publication de Bases Adresse Locale">
          <p>{partenaireDeLaCharte.name} mutualise la production et diffusion des Bases Adresses Locales (BAL).</p>
          <Perimeters perimeters={aggregatePerimeters} />
          <MoissonneurBal sources={sources} />
        </Section>
      )}
    </>
  )
}
