import Section from '@/components/Section'
import Button from '@codegouvfr/react-dsfr/Button'

export default async function SocietesPartenairesPage() {
  return (
    <Section pageTitle="Sociétés partenaires de la Charte">
      <p><b>Organisations d’accompagnement à but lucratif</b></p>
      <p>La loi du 21 février 2022, dite loi &quot;3DS&quot;, réaffirme la compétence de la commune en matière d’adressage. Elle doit procéder à la dénomination des voies, des lieux-dits et à la numérotation des constructions, mais aussi transmettre les données associées à la Base Adresse Nationale. Compte-tenu de la grande diversité des territoires et de l’investissement que cette tâche peut occasionner au démarrage, il peut être pertinent de proposer un accompagnement aux communes, à l’échelle locale. La présente charte s’adresse aux acteurs qui souhaitent proposer cet accompagnement. Son adoption leur permet d’être référencés comme tiers de confiance sur le site national de l’adresse adresse.data.gouv.fr.</p>
      <p><b>En cas de manquements répétés aux engagements demandés, le statut de tiers de confiance sera révoqué ainsi que les droits d’accès associés.</b></p>
      <p>Dans le cas où l’organisation réalise sa prestation sur l’éditeur national Mes Adresses, elle veillera :</p>
      <ul>
        <li>
          À ce que la commune soit administratrice, certifie ses adresses et assure la publication de sa Base Adresse Locale;
        </li>
      </ul>
      <p>Dans le cas où l’organisation utilise son propre outil pour la gestion des adresses, elle veillera :</p>
      <ul>
        <li>
          À ce que cet outil soit en mesure d’importer et d’exporter les données au format BAL1.3;
        </li>
        <li>
          À communiquer à la commune un fichier BAL.csv qu’elle publiera par formulaire ou dépôt sur data.gouv.fr en authentifiant;
        </li>
        <li>
          À transmettre ces données dès que possible après le porter à connaissance de la mise à jour des adresses d’une commune;
        </li>
        <li>
          À veiller à ce que la commune reste au centre de la gestion des adresses, et puisse procéder à la certification;
        </li>
      </ul>
      <p>Par ailleurs, l’organisme s’engage :</p>
      <ul>
        <li>
          À promouvoir les bonnes pratiques d’adressage telles que préconisées sur le site adresse-data.gouv.fr, conformes à l’adressage légal (loi 3DS : « dénomination des voies et lieux-dits, y compris les voies privées ouvertes à la circulation »)
        </li>
        <li>
          À respecter le format d’adresse enrichi Base Adresse Locale et non une norme d’adresse commerciale ;
        </li>
      </ul>
      <h2>Les sociétés partenaires</h2>
      <p>Ces organismes s’engagent à respecter le format Base Adresse Locale (attention, il s’agit d’un format de données bien précis), sa gouvernance et pour ces raisons sont identifiés comme tiers de confiance. Votre organisme respecte déjà ces spécifications mais n’est pas identifié ? Vous pouvez rejoindre les partenaires de la Charte en nous contactant.</p>
      <Button
        iconId="fr-icon-questionnaire-line"
        iconPosition="right"
        // onClick={() => {}}
        priority="secondary"
      >
        Rejoignez-nous
      </Button>
    </Section>
  )
}
