import { getOnePartenairesDeLaCharte } from '@/lib/api-bal-admin'
import Section from '@/components/Section'
import Badge from '@codegouvfr/react-dsfr/Badge'
import ResponsiveImage from '@/components/ResponsiveImage'
import PartenaireReviews from '@/components/PartenairesDeLaCharte/PartenaireReviews'
import { ClientTypeEnum, PartenaireDeLaCharteTypeEnum } from '@/types/partenaire.types'
import PartenaireOrganisme from '@/components/Partenaires/PartenaireOrganisme'

export default async function PartenairePage({ params }: { params: { id: string } }) {
  const partenaireDeLaCharte = await getOnePartenairesDeLaCharte(params.id)

  const availableTabs = []

  if (partenaireDeLaCharte?.clients?.length ?? 0 > 0) {
    if (partenaireDeLaCharte?.clients?.some(({ type }) => type === ClientTypeEnum.API_DEPOT)) {
      availableTabs.push({ tabId: 'api-depot', label: 'API-dépôt' })
    }
    if (partenaireDeLaCharte?.clients?.some(({ type }) => type === ClientTypeEnum.MOISSONNEUR_BAL)) {
      availableTabs.push({ tabId: 'moissonnage', label: 'Moissonnage' })
    }
  }

  return (
    <>
      <Section>
        <div className="fr-grid-row" style={{ flexWrap: 'nowrap', marginBottom: '2rem' }}>
          <ResponsiveImage style={{ maxWidth: 300, maxHeight: 300, marginRight: '1rem' }} src={partenaireDeLaCharte.pictureUrl} alt={`Logo de ${partenaireDeLaCharte.name}`} />
          <div>
            <h2>{partenaireDeLaCharte.name}</h2>
            {partenaireDeLaCharte.organismeInfo
            && <p>{partenaireDeLaCharte.organismeInfo}</p>}
          </div>
        </div>
        {partenaireDeLaCharte.services?.map(s => (
          <Badge style={{ marginRight: '1rem' }} key={s}>{s}</Badge>
        ))}
        {partenaireDeLaCharte.type === PartenaireDeLaCharteTypeEnum.ENTREPRISE && partenaireDeLaCharte.entrepriseReviews && partenaireDeLaCharte.entrepriseReviews.length > 0 && <PartenaireReviews partenaireName={partenaireDeLaCharte.name} reviews={partenaireDeLaCharte.entrepriseReviews} />}
      </Section>
      {partenaireDeLaCharte.type === PartenaireDeLaCharteTypeEnum.ORGANISME && <PartenaireOrganisme availableTabs={availableTabs} partenaireDeLaCharte={partenaireDeLaCharte} />}
    </>
  )
}
