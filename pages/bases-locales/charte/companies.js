import {Award, Mail} from 'react-feather'

import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import SectionText from '@/components/section-text'
import ButtonLink from '@/components/button-link'
import Partners from '@/components/bases-locales/charte/partners'

import companies from '@/data/partners/companies.json'

function Companies() {
  const title = 'Sociétés partenaires de la Charte'
  const description = 'Page vous permettant de consultez et découvrir les organisations à but lucratif partenaires'

  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<Award size={56} />} />

      <Section title='Liste des sociétés partenaires'>
        <SectionText>
          Ces organismes s’engagent à respecter le format Base Adresse Locale (attention, il s’agit d’un format de données bien précis), sa gouvernance et pour ces raisons sont identifiés comme tiers de confiance.
          Votre organisme respecte déjà ces spécifications mais n’est pas identifié ? Vous pouvez rejoindre les partenaires de la Charte en nous contactant.
        </SectionText>
        <div className='contact-button'>
          <ButtonLink href='mailto:adresse@data.gouv.fr' isExternal>
            Contactez-nous
            <Mail style={{verticalAlign: 'bottom', marginLeft: '4px'}} />
          </ButtonLink>
        </div>

        <div className='partners-section'>
          <Partners data={companies} />
        </div>
      </Section>

      <style jsx>{`
        .contact-button {
          text-align: center;
        }

        .partners-section {
          padding-top: 2em;
        }
      `}</style>
    </Page>
  )
}

export default Companies
