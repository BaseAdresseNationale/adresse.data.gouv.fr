import Image from 'next/image'
import {Smile, XCircle} from 'react-feather'

import theme from '@/styles/theme'

import Page from '@/layouts/main'

import Head from '@/components/head'
import Section from '@/components/section'
import SectionText from '@/components/section-text'
import Notification from '@/components/notification'
import ButtonLink from '@/components/button-link'

function Accessibilite() {
  const title = 'Déclaration d’accessibilité'
  const description = 'Consultez la déclaration d’accessibilité de adresse.data.gouv'

  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<Smile size={56} alt aria-hidden='true' />} />

      <Section>
        <div className='accessibility-intro'>
          <div className='accessibility-illustration'>
            <Image src='/images/accessibilite-illustration.svg' layout='responsive' height={100} width={500} alt aria-hidden='true' />
          </div>

          <SectionText>
            <p>
              <b>La Base Adresse Nationale</b> s’engage à rendre ses sites internet, intranet, extranet et ses progiciels <b>accessibles</b> (et ses applications mobiles et mobilier urbain numérique) conformément à <b>l’article 47 de la loi n°2005-102 du 11 février 2005</b>.
              À cette fin, elle met en œuvre la stratégie et les actions suivantes :
            </p>
            <ul>
              <li>Fournir un site web accessible.</li>
              <li>Prêter attention aux informations d’accessibilité des données.</li>
            </ul>
          </SectionText>

          <Notification>
            <p className='declaration-date'>Cette déclaration d’accessibilité a été établie le <b>14/06/2022</b> et s’applique à <b>adresse.data.gouv.fr</b>.</p>
          </Notification>
        </div>
      </Section>

      <Section background='color' title='État de conformité'>
        <Notification type='warning'>
          <div className='conformity'><XCircle alt aria-hidden='true' /> Non conforme</div>
        </Notification>
        <SectionText color='secondary'>
          <b>adresse.data.gouv.fr</b> est non conforme avec le <b>référentiel général d’amélioration de l’accessibilité</b> (RGAA), un audit d’accessibilité n’ayant pas encore été réalisé.
          L’absence d’audit d’accessibilité ne remet pas en cause <b>le caractère accessible</b> du site web actuel.
        </SectionText>
      </Section>

      <Section background='grey' title='Information et contact'>
        <SectionText>
          Si vous n’arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter notre équipe pour être orienté vers <b>une alternative accessible</b> ou obtenir le contenu sous une autre forme.
        </SectionText>
        <div className='button-container'>
          <ButtonLink href='mailto:adresse@data.gouv.fr' isExternal>Nous contacter</ButtonLink>
        </div>
      </Section>

      <Section title='Voie de recours'>
        <SectionText>
          <p>Si vous constatez <b>un défaut d’accessibilité</b> vous empêchant d’accéder à un contenu ou une fonctionnalité du site, que vous nous le signalez et que vous ne parvenez pas à obtenir une réponse de notre part, vous êtes en droit de faire parvenir vos doléances ou une demande de saisine au <b>Défenseur des droits</b>.<br />
            Plusieurs moyens sont à votre disposition :
          </p>
          <ul>
            <li>Écrire un message au <b>Défenseur des droits</b>.</li>
            <li>Contacter <b>le délégué du Défenseur des droits</b> dans votre région.</li>
            <li>Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre).<br />
              <b>
                Défenseur des droits<br />
                Libre réponse 71120<br />
                75342 Paris CEDEX 07
              </b>
            </li>
          </ul>
        </SectionText>
      </Section>

      <style jsx>{`
        .accessibility-intro {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .accessibility-illustration {
          width: 100%;
          max-width: 500px;
        }

        .declaration-date {
          text-align: center;
          font-size: large;
        }

        .conformity {
          font-weight: bold;
          font-size: x-large;
          color: ${theme.errorBorder};
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 10px;
        }

        .button-container {
          text-align: center;
        }
      `}</style>
    </Page>
  )
}

export default Accessibilite
