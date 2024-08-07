import SearchPartenaire from '@/components/SearchPartenaire'
import Section from '@/components/Section'
import { getPartenairesDeLaCharte, getPartenairesDeLaCharteServices, PaginatedPartenairesDeLaCharte } from '@/lib/api-bal-admin'
import { getDepartements } from '@/lib/api-geo'
import { PartenaireDeLaCharteTypeEnum } from '@/types/partenaire.types'
import { displayWithPlural } from '@/utils/string'
import Button from '@codegouvfr/react-dsfr/Button'

export default async function OrganismesPartenairesPage() {
  const services = await getPartenairesDeLaCharteServices()
  const initialPartenaires = await getPartenairesDeLaCharte({
    type: PartenaireDeLaCharteTypeEnum.ORGANISME,
  })
  const departements = await getDepartements()

  async function renderInfos(paginatedPartenaires: PaginatedPartenairesDeLaCharte) {
    'use server'
    return <p>{displayWithPlural(paginatedPartenaires.totalOrganismes, 'organisme')}</p>
  }

  return (
    <Section pageTitle="Organismes partenaires de la Charte">
      <p><b>Organismes d’accompagnement à but non lucratif (EPCI, départements, syndicats mixtes…)</b></p>
      <p>La loi du 21 février 2022, dite loi &quot;3DS&quot;, réaffirme la compétence de la commune en matière d’adressage. Elle doit procéder à la dénomination des voies, des lieux-dits et à la numérotation des constructions, mais aussi transmettre les données associées à la Base Adresse Nationale. Compte-tenu de la grande diversité des territoires et de l’investissement que cette tâche peut occasionner au démarrage, il peut être pertinent de proposer un accompagnement aux communes, à l’échelle locale. La présente charte s’adresse aux acteurs qui souhaitent proposer cet accompagnement. Son adoption leur permet d’être référencés comme tiers de confiance sur le site national de l’adresse adresse.data.gouv.fr et de disposer eux-mêmes d’un accompagnement de niveau national et d’outils adaptés.</p>
      <p>La présente charte est valable trois mois, à échéance en fin de trimestre, et renouvelée par tacite reconduction.</p>
      <p><b>En cas de manquements répétés aux engagements demandés, le statut de tiers de confiance sera révoqué ainsi que les droits d’accès associés.</b></p>
      <p>Les actions concrètes prévues par la présente charte sont les suivantes :</p>
      <ul>
        <li>
          Former la commune à l’utilisation d’un outil de gestion des adresses (tel que l’éditeur en ligne mes-adresses.data.gouv.fr, ou tout autre outil équivalent) ;
        </li>
        <li>
          Informer la commune de l’importance de tenir à jour sa Base Adresse Locale selon les modalités prévues par la loi et l’aider à mettre en place des processus ou routines ;
        </li>
        <li>
          Promouvoir les bonnes pratiques d’adressage telles que préconisées sur le site adresse-data.gouv.fr, conformes à l’adressage légal (loi 3DS : « dénomination des voies et lieux-dits, y compris les voies privées ouvertes à la circulation »).
        </li>
      </ul>
      <p>
        Dans le cas où l’organisme se dote d’un outil mutualisé pour la gestion des adresses, il veillera :
      </p>
      <ul>
        <li>
          À ce que cet outil soit en mesure d’importer et d’exporter les données au format BAL 1.3 ;
        </li>
        <li>
          À s’interfacer, pour les données produites via l’outil, avec l’un des dispositifs officiels de remontée des Bases Adresses Locales au niveau national : l’API de dépôt ou le moissonneur ;
        </li>
        <li>
          À transmettre ces données dès que possible après le porter à connaissance de la mise à jour des adresses d’une commune, et au plus tard au bout de 7 jours ;
        </li>
        <li>
          À veiller à ce que la commune reste au centre de la gestion des adresses, et puisse procéder à la certification ;
        </li>
        <li>
          À garantir l’autonomie de la commune quant au choix de son outil de gestion et à sa réversibilité.
        </li>
      </ul>
      <p>
        Dans le cas où l’organisme met en place des formations ou un accompagnement, et si des prestations tarifées sont proposées par un partenaire de l’organisme tiers de confiance, ce dernier devra garantir une concurrence non faussée et permettre à d’autres acteurs économiques de proposer leurs services de façon équitable.
      </p>
      <p>
        Par ailleurs, l’organisme s’engage :
      </p>
      <ul>
        <li>
          À promouvoir la Base Adresse Nationale comme base de données de référence pour les adresses en France ;
        </li>
        <li>
          À utiliser la Base Adresse Nationale dans ses outils et services ;
        </li>
        <li>
          À ne pas introduire de traitements intermédiaires entre les communes autonomes et l’échelon national ;
        </li>
        <li>
          À communiquer l’URL du point d’accès national de la Base Adresse Nationale lors qu’un partenaire demande des données adresses. Il doit en effet s’abstenir de diffuser lui-même une donnée qui pourrait être datée ou non validée par la Base Adresse Nationale. En effet, le service public de la donnée garantit que les réutilisateurs disposent tous de la même base, à jour.
        </li>
      </ul>
      <h2>Les organismes partenaires</h2>
      <p>Ces organismes s’engagent à respecter le format Base Adresse Locale (attention, il s’agit d’un format de données bien précis), sa gouvernance et pour ces raisons sont identifiés comme tiers de confiance. Votre organisme respecte déjà ces spécifications mais n’est pas identifié ? Vous pouvez rejoindre les partenaires de la Charte en nous contactant.</p>
      <Button
        iconId="fr-icon-questionnaire-line"
        iconPosition="right"
        // onClick={() => {}}
        priority="secondary"
        style={{ marginBottom: '1rem' }}
      >
        Rejoignez-nous
      </Button>
      <SearchPartenaire
        searchBy="name"
        services={services}
        initialPartenaires={initialPartenaires}
        departements={departements}
        filter={{ type: PartenaireDeLaCharteTypeEnum.ORGANISME }}
        renderInfos={renderInfos}
      />
    </Section>
  )
}
