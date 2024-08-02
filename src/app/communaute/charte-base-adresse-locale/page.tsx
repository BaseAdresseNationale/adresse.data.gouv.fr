import DownloadCard from '@/components/DownloadCard'
import { StyledPage } from './page.styles'
import { getPartenairesDeLaCharteServices } from '@/lib/api-bal-admin'
import SearchItems from '@/components/SearchItems'

export default async function CharteBALPage() {
  const services = await getPartenairesDeLaCharteServices()

  return (
    <StyledPage pageTitle="Charte de la Base adresse locale">
      <p>La Charte de la Base Adresse Locale rassemble les organismes qui privilégient le format Base Adresse Locale et s’engagent en matière de gouvernance. L’enjeu pour la commune, autorité responsable de l’adresse, est d’identifier un référent en capacité de l’assister au besoin. Les organismes partenaires présentent la Charte sur leur site Internet et la respectent. Ces organismes s’engagent également à respecter le principe du &quot;Dites-le nous une fois de l’adresse&quot;. Ils sont référencés comme tiers de confiance sur ce site.</p>
      <p>Elle est disponible en trois versions :</p>
      <ul>
        <li>
          Un format qui s’adresse aux communes qui partagent leur expérience avec d’autres communes.
        </li>
        <li>
          Un format dédié aux organismes qui accompagnent les communes.
        </li>
        <li>
          Un format pour les organisations à but lucratif qui proposent une prestation d’adressage aux communes.
        </li>
      </ul>
      <p>
        Les deux versions de la Charte ont en partage le respect du format de données Base Adresse Locale et d’une gouvernance qui place la commune au coeur du dispositif de l’adresse.
      </p>
      <h2>Télécharger</h2>
      <div className="download-card-wrapper">
        <DownloadCard
          title="Télécharger la charte des communes partenaires"
          text="La charte des communes partenaires est destinée aux communes qui partagent leur expérience avec d’autres communes."
          fileDescription="PDF - 295 ko"
          downloadlink="/chartes-partenaires/charte-bal-communes-v1.2.pdf"
        />
        <DownloadCard
          title="Télécharger la charte des organismes partenaires"
          text="La charte des organismes partenaires est destinée aux organismes publics qui accompagnent les communes."
          fileDescription="PDF - 238 ko"
          downloadlink="/chartes-partenaires/charte-bal-organismes-v2.1.pdf"
        />
        <DownloadCard
          title="Télécharger la charte des sociétés partenaires"
          text="La charte des sociétés partenaires est destinée aux sociétés à but lucratif qui proposent une prestation d’adressage aux communes."
          fileDescription="PDF - 235 ko"
          downloadlink="/chartes-partenaires/charte-bal-societe-v1.1.pdf"
        />
      </div>
      <h2>Partenaires disponibles sur votre territoire</h2>
      <p>De nombreux partenaires de la Charte de la Base Adresse Locale proposent un accompagnement et/ou des outils adaptés à votre territoire</p>
      <SearchItems services={services} />
    </StyledPage>
  )
}
