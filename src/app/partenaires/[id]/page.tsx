import { getOnePartenairesDeLaCharte } from '@/lib/api-bal-admin'
import Section from '@/components/Section'
import Badge from '@codegouvfr/react-dsfr/Badge'
import ResponsiveImage from '@/components/ResponsiveImage'
import PartenaireReviews from '@/components/PartenairesDeLaCharte/PartenaireReviews'
import { PartenaireDeLaCharteTypeEnum } from '@/types/partenaire.types'
import PartenaireOrganisme from '@/components/Partenaires/PartenaireOrganisme'

export default async function PartenairePage({ params }: { params: { id: string } }) {
  const partenaireDeLaCharte = await getOnePartenairesDeLaCharte(params.id)

  const availableTabs = []

  if (partenaireDeLaCharte.apiDepotClientId && partenaireDeLaCharte.apiDepotClientId.length > 0) {
    availableTabs.push({ tabId: 'api-depot', label: 'API-dépôt' })
  }
  if (partenaireDeLaCharte.dataGouvOrganizationId && partenaireDeLaCharte.dataGouvOrganizationId.length > 0) {
    availableTabs.push({ tabId: 'moissonnage', label: 'Moissonnage' })
  }

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
        {partenaireDeLaCharte.type === PartenaireDeLaCharteTypeEnum.ENTREPRISE && partenaireDeLaCharte.reviews && partenaireDeLaCharte.reviews.length > 0 && <PartenaireReviews reviews={partenaireDeLaCharte.reviews} />}
      </Section>
      {partenaireDeLaCharte.type === PartenaireDeLaCharteTypeEnum.ORGANISME && <PartenaireOrganisme availableTabs={availableTabs} partenaireDeLaCharte={partenaireDeLaCharte} />}
    </>
  )
}
