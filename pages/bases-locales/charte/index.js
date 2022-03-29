import Image from 'next/image'
import {Download, Mail} from 'react-feather'

import Page from '@/layouts/main'

import Head from '@/components/head'
import Section from '@/components/section'
import PartnersSearchbar from '@/components/bases-locales/charte/partners-searchbar'
import SectionText from '@/components/section-text'
import ButtonLink from '@/components/button-link'
import Card from '@/components/card'

function Charte() {
  const title = 'Charte et organismes partenaires'
  const description = 'Page vous permettant de consultez et téléchargez la charte Base Adresse Locale et de découvrir les organismes partenaires'

  return (
    <Page title={title} description={description} >
      <Head title={title} icon={<Download size={56} />} />

      <Section background='white' title='Charte de la Base Adresse Locale'>
        <SectionText>
          <p className='charte-container'>
            La Charte de la Base Adresse Locale rassemble les organismes qui privilégient le format Base Adresse Locale et s’engagent en matière de gouvernance. L’enjeu pour la commune, autorité responsable de l’adresse, est d’identifier un référent en capacité de l’assister au besoin. Les organismes partenaires présentent la Charte sur leur site Internet et la respectent.
          </p>
          <div>
            Elle est disponible en deux versions :
            <ul className='charte-list'>
              <li>Un format qui s’adresse aux <b>communes qui partagent leur expérience</b> avec d’autres communes.</li>
              <li>Un format dédié aux <b>organismes qui accompagnent les communes</b>.</li>
            </ul>
            <p>Les deux versions de la Charte ont en partage le respect du format de données <a href='https://doc.adresse.data.gouv.fr/mettre-a-jour-sa-base-adresse-locale/le-format-base-adresse-locale'>Base Adresse Locale</a> et d’une gouvernance qui place la commune au coeur du dispositif de l’adresse.</p>
          </div>
        </SectionText>
      </Section>

      <Section background='color' title='Rejoindre les partenaires de la Charte '>
        <SectionText color='secondary'>
          <p>
            Contactez nous avec en objet « Partenaire de la Charte » pour demander la version de la Charte au <b>nom de votre commune ou de votre organisme</b>. Les chartes ci-dessous sont présentées à titre indicatif.
          </p>
        </SectionText>
        <div className='contact-button'>
          <ButtonLink href='mailto:adresse@data.gouv.fr' color='white' isExternal isOutlined>
            Contactez-nous
            <Mail style={{verticalAlign: 'bottom', marginLeft: '4px'}} />
          </ButtonLink>
        </div>

        <div className='downloads-container'>
          <Card
            link='https://adresse.data.gouv.fr/data/docs/charte-bal-communes-v1.1.pdf'
            title='Charte des communes partenaires'
            color='secondary'
          >
            <Image
              src='/images/previews/charte-communes.png'
              alt='miniature de la charte des communes'
              width={150}
              height={200}
              objectFit='contain'
            />
          </Card>

          <Card
            link='https://adresse.data.gouv.fr/data/docs/charte-bal-organismes-v1.1.pdf'
            title='Charte des organismes partenaires'
            color='secondary'
          >
            <Image
              src='/images/previews/charte-organismes.png'
              alt='miniature de la charte des organismes'
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
      </Section>

      <Section background='grey' title='Organismes partenaires de la Charte'>
        <SectionText>
          <p>
            La présence de cette Charte de la Base Adresse Locale sur le site Internet d’un organisme signifie qu’il privilégie le format Base Adresse Locale pour la transmission des adresses communales à la Base Adresse Nationale.
            Cet organisme est donc référencé sur adresse.data.gouv.fr. Cette charte vise à fédérer le plus grand nombre d’acteurs qui ont en commun le souhait d’utiliser et de promouvoir les Bases Adresses Locales à travers plusieurs actions dédiées.
          </p>
          <ul className='charte-list'>
            <li>L’organisme promeut une gouvernance qui assure à la commune d’être la seule autorité compétente sur l’adresse à travers sa Base Adresse Locale même si elle peut en déléguer la réalisation technique. En outre, une commune peut à tout moment reprendre une gestion autonome de ses adresses.</li>
            <li>L’organisme soutient, valorise (selon le cas) des formations permettant à la commune d’administrer sa Base Adresse Locale sur mes-adresses.data.gouv.fr lorsque la commune ne dispose pas d’outils (les siens ou ceux du délégataire).</li>
            <li>L’organisme veille à la participation active de la commune pour certifier ses adresses.</li>
            <li>L’organisme informe la commune de l’importance de mettre à jour régulièrement ses adresses et de créer une routine.</li>
            <li>L’organisme encourage et facilite la transmission rapide de la Base Adresse Locale à la Base Adresse Nationale.</li>
            <li>S’il souhaite prendre en charge l’alimentation de la Base Adresse Nationale, l’organisme devra privilégier l’API de dépôt, et ce dès que possible après le porter à connaissance de la nouvelle version de la Base Adresse Locale d’une commune.</li>
          </ul>
        </SectionText>
      </Section>

      <Section id='recherche-partenaires' title='Outils disponibles sur votre territoire' subtitle='De nombreux partenaires de la Charte de la Base Adresse Locale proposent un accompagnement et/ou des outils adaptés à votre territoire'>
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

        .downloads-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          margin-top: 3em;
        }
      `}</style>
    </Page>
  )
}

export default Charte
