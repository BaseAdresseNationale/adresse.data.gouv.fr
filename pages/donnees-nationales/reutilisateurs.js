import {Users, Mail} from 'react-feather'

import Page from '@/layouts/main'

import Head from '@/components/head'
import Section from '@/components/section'
import ButtonLink from '@/components/button-link'
import Partners from '@/components/bases-locales/charte/partners'

import reUsersBan from '@/data/partners/re-users-ban.json'

function Reutilisateurs() {
  const title = 'Réutilisateurs de la BAN'
  const description = 'Fichiers nationaux contenant les adresses du territoire.'

  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<Users size={56} alt aria-hidden='true' />} />

      <Section title='Qui réutilise la BAN&nbsp;?'>
        <div className='partners-section'>
          <Partners data={reUsersBan} />
        </div>
      </Section>

      <Section subtitle='Pour apparaître dans cette liste de réutilisateurs, contactez-nous :' background='grey'>
        <div className='contact-button'>
          <ButtonLink href='mailto:adresse@data.gouv.fr' isExternal>
            Contactez-nous
            <Mail style={{verticalAlign: 'bottom', marginLeft: '4px'}} alt aria-hidden='true' />
          </ButtonLink>
        </div>
      </Section>

      <style jsx>{`
        .contact-button {
          padding-top: 2em;
          text-align: center;
        }

        .partners-section {
          padding-top: 2em;
        }
      `}</style>
    </Page>
  )
}

export default Reutilisateurs
