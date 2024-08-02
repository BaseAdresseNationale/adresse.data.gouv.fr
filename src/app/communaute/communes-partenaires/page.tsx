import Section from '@/components/Section'
import Button from '@codegouvfr/react-dsfr/Button'

export default async function CommunesPartenairesPage() {
  return (
    <Section pageTitle="Communes partenaires de la Charte">
      <p>La présence de cette Charte de la Base Adresse Locale sur le site Internet d’une commune signifie qu’elle utilise le format Base Adresse Locale pour la transmission de ses adresses à la Base Adresse Nationale et promeut ce format. Cette commune est donc référencée sur adresse.data.gouv.fr pour la qualité de ses adresses et sa démarche de partage d’expérience auprès d’autres communes. Cette charte vise à fédérer les communes qui ont en commun le souhait de partager leur expérience et à faciliter la diffusion des bonnes pratiques entre pairs.</p>
      <p>Elle est disponible en trois versions :</p>
      <ul>
        <li>
          La commune promeut une gouvernance qui assure à la commune d’être la seule autorité compétente sur l’adresse à travers sa Base Adresse Locale même si elle peut en déléguer la réalisation technique. Si elle délègue cette réalisation technique, elle peut à tout moment reprendre une gestion autonome de ses adresses.
        </li>
        <li>
          La commune procède à la « dénomination des voies et lieux-dits, y compris les voies privées ouvertes à la circulation » et à la numérotation des constructions conformément à l’article 169 de la loi du 21 février 2022, dite loi &quot;3DS&quot;.
        </li>
        <li>
          La commune veille à certifier ses adresses.
        </li>
        <li>
          La commune met à jour régulièrement ses adresses et crée une routine pour leur conserver leur qualité.
        </li>
        <li>
          La commune encourage et facilite la transmission rapide de sa Base Adresse Locale à la Base Adresse Nationale.
        </li>
        <li>
          La commune privilégie l’API de dépôt via Mes Adresses, le formulaire de dépôt ou une utilisation directe de l’API et ce dès que possible après le porter à connaissance de nouvelles adresses.
        </li>
        <li>
          Partage d’expériences : la commune encourage le partage d’expériences avec d’autres communes, contribuant à la diffusion des bonnes pratiques de l’adresse sur mes-adresses.data.gouv.fr si elles ne disposent pas d’outils (les leurs ou ceux du délégataire).
        </li>
      </ul>
      <h2>Les communes partenaires</h2>
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
