import Image from 'next/legacy/image'
import {Download, Mail, Info} from 'react-feather'

import theme from '@/styles/theme'

import Page from '@/layouts/main'

import Head from '@/components/head'
import Section from '@/components/section'
import PartnersSearchbar from '@/components/bases-locales/charte/partners-searchbar'
import SectionText from '@/components/section-text'
import ButtonLink from '@/components/button-link'
import Card from '@/components/card'
import Notification from '@/components/notification'

function Charte() {
  const title = 'Charte et organismes partenaires'
  const description = 'Page vous permettant de consultez et téléchargez la charte Base Adresse Locale et de découvrir les organismes partenaires'

  return (
    <Page title={title} description={description} >
      <Head title={title} icon={<Download size={56} alt aria-hidden='true' />} />

      <Section background='white' title='Charte de la Base Adresse Locale'>
        <SectionText>
          <p className='charte-container'>
            La Charte de la Base Adresse Locale rassemble les organismes qui privilégient le format Base Adresse Locale et s’engagent en matière de gouvernance. L’enjeu pour la commune, autorité responsable de l’adresse, est d’identifier un référent en capacité de l’assister au besoin. Les organismes partenaires présentent la Charte sur leur site Internet et la respectent. Ces organismes s’engagent également à respecter le principe du &quot;Dites-le nous une fois de l’adresse&quot;. Ils sont référencés comme tiers de confiance sur ce site.
          </p>
          <div>
            Elle est disponible en trois versions :
            <ul className='charte-list'>
              <li>Un format qui s’adresse aux <b>communes qui partagent leur expérience</b> avec d’autres communes.</li>
              <li>Un format dédié aux <b>organismes qui accompagnent les communes</b>.</li>
              <li>Un format pour les <b>organisations à but lucratif</b> qui proposent une prestation d’adressage aux communes.</li>
            </ul>
            <p>Les deux versions de la Charte ont en partage le respect du <a href='https://doc.adresse.data.gouv.fr/mettre-a-jour-sa-base-adresse-locale/le-format-base-adresse-locale'>format de données Base Adresse Locale</a> et d’une gouvernance qui place la commune au coeur du dispositif de l’adresse.</p>
          </div>
        </SectionText>
      </Section>

      <Section background='color' title='Rejoindre les partenaires de la Charte'>
        <SectionText color='secondary'>
          <p>
            Contactez nous avec en objet « Partenaire de la Charte » pour demander la version de la Charte au <b>nom de votre commune ou de votre organisme</b>. Les chartes ci-dessous sont présentées à titre indicatif.
          </p>
        </SectionText>
        <div className='contact-button'>
          <ButtonLink href='mailto:adresse@data.gouv.fr' color='white' isExternal isOutlined>
            Contactez-nous
            <Mail style={{verticalAlign: 'bottom', marginLeft: '4px'}} alt aria-hidden='true' />
          </ButtonLink>
        </div>

        <div className='downloads-container'>
          <Card
            link='https://adresse.data.gouv.fr/data/docs/charte-bal-communes-v1.1.pdf'
            action='Télécharger la charte des communes partenaires'
            title='Charte des communes partenaires'
            color='secondary'
          >
            <Image
              src='/images/previews/charte-communes.png'
              alt
              width={150}
              height={200}
              objectFit='contain'
            />
          </Card>

          <Card
            link='https://adresse.data.gouv.fr/data/docs/charte-bal-organismes.pdf'
            action='Télécharger la charte des organismes partenaires'
            title='Charte des organismes partenaires'
            color='secondary'
          >
            <Image
              src='/images/previews/charte-organismes.png'
              alt
              width={150}
              height={200}
              objectFit='contain'
            />
          </Card>

          <Card
            link='https://adresse.data.gouv.fr/data/docs/charte-bal-societe.pdf'
            action='Télécharger la charte des sociétés partenaires'
            title='Charte des sociétés partenaires'
            color='secondary'
          >
            <Image
              src='/images/previews/charte-societes.png'
              width={150}
              height={200}
              objectFit='contain'
            />
          </Card>
        </div>
      </Section>

      <Section title='Communes partenaires de la Charte'>
        <SectionText>
          <p>
            La présence de cette Charte de la Base Adresse Locale sur le site Internet d’une commune signifie qu’elle utilise le format Base Adresse Locale pour la transmission de ses adresses à la Base Adresse Nationale et promeut ce format.
            Cette commune est donc référencée sur adresse.data.gouv.fr pour la qualité de ses adresses et sa démarche de partage d’expérience auprès d’autres communes. Cette charte vise à fédérer les communes qui ont en commun le souhait de partager leur expérience et à faciliter la diffusion des bonnes pratiques entre pairs.
          </p>
          <ul className='charte-list'>
            <li>La commune promeut une gouvernance qui assure à la commune d’être la seule autorité compétente sur l’adresse à travers sa Base Adresse Locale même si elle peut en déléguer la réalisation technique. Si elle délègue cette réalisation technique, elle peut à tout moment reprendre une gestion autonome de ses adresses.</li>
            <li>La commune veille à certifier ses adresses.</li>
            <li>La commune met à jour régulièrement ses adresses et crée une routine pour leur conserver leur qualité.</li>
            <li>La commune encourage et facilite la transmission rapide de sa Base Adresse Locale à la Base Adresse Nationale.</li>
            <li>La commune privilégie l’API de dépôt via Mes Adresses, le formulaire de dépôt ou une utilisation directe de l’API et ce dès que possible après le porter à connaissance de nouvelles adresses.</li>
            <li>Partage d’expériences : la commune encourage le partage d’expériences avec d’autres communes, contribuant à la diffusion des bonnes pratiques de l’adresse sur mes-adresses.data.gouv.fr si elles ne disposent pas d’outils (les leurs ou ceux du délégataire).</li>
          </ul>
        </SectionText>
        <div className='redirection-button'>
          <ButtonLink href='/bases-locales/charte/communes'>Découvrir les communes partenaires</ButtonLink>
        </div>
      </Section>

      <Section background='grey' title='Organismes partenaires de la Charte' subtitle='Organismes d’accompagnement à but non lucratif (EPCI, départements, syndicats mixtes…)'>
        <SectionText>
          <p>
            La loi du 21 février 2022, dite loi &quot;3DS&quot;, réaffirme la compétence de la commune en matière d’adressage. Elle doit procéder à la dénomination des voies, des lieux-dits et à la numérotation des constructions, mais aussi transmettre les données associées à la Base Adresse Nationale.
            Compte-tenu de la grande diversité des territoires et de l’investissement que cette tâche peut occasionner au démarrage, il peut être pertinent de proposer un accompagnement aux communes, à l’échelle locale.
            La présente charte s’adresse aux acteurs qui souhaitent proposer cet accompagnement. Son adoption leur permet d’être référencés comme tiers de confiance sur le site national de l’adresse adresse.data.gouv.fr et de disposer eux-mêmes d’un accompagnement de niveau national et d’outils adaptés.
          </p>
          <p>La présente charte est valable trois mois, à échéance en fin de trimestre, et renouvelée par tacite reconduction.</p>
          <Notification>
            <p className='info'><Info /><b>En cas de manquements répétés aux engagements demandés, le statut de tiers de confiance sera révoqué ainsi que les droits d’accès associés.</b></p>
          </Notification>

          <div className='organisme-charte'>
            <div>
              <b>Les actions concrètes prévues par la présente charte sont les suivantes :</b>
              <ul className='charte-list'>
                <li>former la commune à l’utilisation d’un outil de gestion des adresses (tel que l’éditeur en ligne mes-adresses.data.gouv.fr, ou tout autre outil équivalent) ;</li>
                <li>informer la commune de l’importance de tenir à jour sa Base Adresse Locale selon les modalités prévues par la loi et l’aider à mettre en place des processus ou routines ;</li>
                <li>promouvoir les bonnes pratiques d’adressage telles que préconisées sur le site adresse.data.gouv.fr.</li>
              </ul>
            </div>
            <div>
              <b>Dans le cas où l’organisme se dote d’un outil mutualisé pour la gestion des adresses, il veillera :</b>
              <ul className='charte-list'>
                <li>à ce que cet outil soit en mesure d’importer et d’exporter les données au format BAL 1.3 ;</li>
                <li>à s’interfacer, pour les données produites via l’outil, avec l’un des dispositifs officiels de remontée des Bases Adresses Locales au niveau national : l’API de dépôt ou le moissonneur ;</li>
                <li>à transmettre ces données dès que possible après le porter à connaissance de la mise à jour des adresses d’une commune, et au plus tard au bout de 7 jours ;</li>
                <li>à veiller à ce que la commune reste au centre de la gestion des adresses, et puisse procéder à la certification ;</li>
                <li>à garantir l’autonomie de la commune quant au choix de son outil de gestion et à sa réversibilité.</li>
              </ul>
            </div>
            <p>
              Dans le cas où l’organisme met en place des formations ou un accompagnement, et si des prestations tarifées sont proposées par un partenaire de l’organisme tiers de confiance, ce dernier devra garantir une concurrence non faussée et permettre à d’autres acteurs économiques de proposer leurs services de façon équitable.
            </p>
            <div>
              <b>Par ailleurs, l’organisme s’engage :</b>
              <ul className='charte-list'>
                <li>à promouvoir la Base Adresse Nationale comme base de données de référence pour les adresses en France ;</li>
                <li>à utiliser la Base Adresse Nationale dans ses outils et services ;</li>
                <li>à ne pas introduire de traitements intermédiaires entre les communes autonomes et l’échelon national ;</li>
                <li>à communiquer l’URL du point d’accès national de la Base Adresse Nationale lors qu’un partenaire demande des données adresses. Il doit en effet s’abstenir de diffuser lui-même une donnée qui pourrait être datée ou non validée par la Base Adresse Nationale. En effet, le service public de la donnée garantit que les réutilisateurs disposent tous de la même base, à jour.</li>
              </ul>
            </div>
          </div>
        </SectionText>
        <div className='redirection-button'>
          <ButtonLink href='/bases-locales/charte/organismes'>Découvrir les organismes partenaires</ButtonLink>
        </div>
      </Section>

      <Section title='Sociétés partenaires de la Charte' subtitle='Organisations d’accompagnement à but lucratif'>
        <SectionText>
          <p>La loi du 21 février 2022, dite loi &quot;3DS&quot;, réaffirme la compétence de la commune en matière d’adressage. Elle doit procéder à la dénomination des voies, des lieux-dits et à la numérotation des constructions, mais aussi transmettre les données associées à la Base Adresse Nationale. Compte-tenu de la grande diversité des territoires et de l’investissement que cette tâche peut occasionner au démarrage, il peut être pertinent de proposer un accompagnement aux communes, à l’échelle locale. La présente charte s’adresse aux acteurs qui souhaitent proposer cet accompagnement. Son adoption leur permet d’être référencés comme tiers de confiance sur le site national de l’adresse adresse.data.gouv.fr.</p>
          <Notification>
            <p className='info'><Info /><b>En cas de manquements répétés aux engagements demandés, le statut de tiers de confiance sera révoqué ainsi que les droits d’accès associés.</b></p>
          </Notification>

          <div className='organisme-charte'>
            <div>
              <b>Dans le cas où l’organisation réalise sa prestation sur l’éditeur national Mes Adresses, elle veillera :</b>
              <ul>
                <li>à ce que la commune soit administratrice, certifie ses adresses et assure la publication de sa Base Adresse Locale;</li>
              </ul>
            </div>
            <div>
              <b>Dans le cas où l’organisation utilise son propre outil pour la gestion des adresses, elle veillera :</b>
              <ul>
                <li>à ce que cet outil soit en mesure d’importer et d’exporter les données au format BAL1.3;</li>
                <li>à communiquer à la commune un fichier BAL.csv qu’elle publiera par formulaire ou dépôt sur data.gouv.fr en authentifiant;</li>
                <li>à transmettre ces données dès que possible après le porter à connaissance de la mise à jour des adresses d’une commune;</li>
                <li>à veiller à ce que la commune reste au centre de la gestion des adresses, et puisse procéder à la certification;</li>
              </ul>
            </div>
            <div>
              <b>Par ailleurs, l’organisme s’engage :</b>
              <ul>
                <li>à promouvoir les bonnes pratiques d’adressage telles que préconisées sur le site adresse.data.gouv.fr;</li>
                <li>à respecter le format d’adresse enrichi Base Adresse Locale et non une norme d’adresse commerciale ;</li>
              </ul>
            </div>
          </div>
        </SectionText>
        <div className='redirection-button'>
          <ButtonLink href='/bases-locales/charte/companies'>Découvrir les sociétés partenaires</ButtonLink>
        </div>
      </Section>

      <Section background='grey' id='recherche-partenaires' title='Outils disponibles sur votre territoire' subtitle='De nombreux partenaires de la Charte de la Base Adresse Locale proposent un accompagnement et/ou des outils adaptés à votre territoire'>
        <div>
          <PartnersSearchbar />
        </div>
      </Section>

      <style jsx>{`
        .charte-download-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 1.5em;
        }

        .charte-container {
          margin-top: 3em;
        }

        .charte-list li {
          margin-top: 0.5em;
        }

        .contact-button {
          text-align: center;
        }

        .info {
          margin: 0;
          color: ${theme.primary};
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .organisme-charte {
          margin-top: 3em;
        }

        .organisme-charte b {
          text-decoration: underline;
        }

        .downloads-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
          gap: 1.5em;
        }

        .redirection-button {
          text-align: center;
        }
      `}</style>
    </Page>
  )
}

export default Charte
