import {Users, Mail} from 'react-feather'

import Page from '@/layouts/main'

import Head from '@/components/head'
import Section from '@/components/section'
import ButtonLink from '@/components/button-link'
import UsersBAN from '@/components/donnees-nationales/users-ban'

import usersData from '@/data/partners/users-ban.json'

function Reutilisateurs() {
  const title = 'Usages de la BAN'
  const description = 'Fichiers nationaux contenant les adresses du territoire.'

  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<Users size={56} alt='' aria-hidden='true' />} />

      <p className='description'>
        L’adresse est une donnée d’intérêt général, son utilisation est un enjeu dans de nombreux domaines :<br />services publics, services de sécurité et de secours, gestionnaires de réseaux, services de livraison, de localisation et navigation, services clients et geomarketing , assurances…
      </p>

      <Section subtitle='Quelques exemples parmi les milliers d’usages réguliers de la BAN'>
        <div className='re-users-section'>
          <UsersBAN data={usersData} />
        </div>
      </Section>

      <Section subtitle='Retrouvez plusieurs cas d’usages de la BAN sur notre Blog' background='grey'>
        <div className='blog-button'>
          <ButtonLink href='https://adresse.data.gouv.fr/blog'>
            Ouvrir le Blog
          </ButtonLink>
        </div>
      </Section>

      <Section subtitle='Pour apparaître dans cette liste d’utilisateurs, contactez-nous :'>
        <div className='contact-button'>
          <ButtonLink href='mailto:adresse@data.gouv.fr' isExternal>
            Contactez-nous
            <Mail style={{verticalAlign: 'bottom', marginLeft: '4px'}} alt='' aria-hidden='true' />
          </ButtonLink>
        </div>
      </Section>

      <style jsx>{`

        .description {
          text-align: center;
        }

        .contact-button {
          padding-top: 2em;
          text-align: center;
        }

        .blog-button {
          padding-top: 2em;
          text-align: center;
        }

      `}</style>
    </Page>
  )
}

export default Reutilisateurs
