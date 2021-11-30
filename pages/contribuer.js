import {Edit2, Mail, MapPin} from 'react-feather'

import Page from '@/layouts/main'
import theme from '@/styles/theme'
import Head from '@/components/head'
import Section from '@/components/section'
import SearchCommuneContact from '@/components/search-commune-contact'
import ButtonLink from '@/components/button-link'
import SectionText from '@/components/section-text'

const title = 'Contribuer'
const description = 'Les différents outils à votre disposition pour contribuer à améliorer les données Adresse.'

function Contribuer() {
  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<Edit2 size={56} />} />
      <Section subtitle='Que vous soyez une commune, une entreprise ou un simple citoyen, vous pouvez contribuer à la Base Adresse Nationale' background='grey' />

      <Section title='En tant que commune' subtitle='Créer une Base Adresse Locale'>
        <div style={{textAlign: 'center'}}>
          <SectionText>
            <p>
              La <b>création des voies et des adresses</b> est une compétence de la commune, via le conseil municipal.<br />{}
              Les communes sont donc considérées comme les <b>productrices</b> de la donnée Adresse à l’échelle de leur territoire, et sont à même de lui conférer un <b>caractère officiel</b>.
            </p>
            <p>
              <b>Plusieurs outils</b> existent leur permettant d’exercer cette compétence essentielle.
            </p>
          </SectionText>
          <ButtonLink size='large' href='/gerer-mes-adresses'>Gérer mes adresses <MapPin style={{verticalAlign: 'bottom', marginRight: '5px'}} /></ButtonLink>
        </div>
      </Section>

      <Section title='En tant que citoyen' background='grey'>
        <SectionText >
          <p>Il n’existe pas encore de <strong>dispositif national</strong> permettant aux citoyens de contribuer directement, mais de nombreux guichets de signalement existent à l’échelon local. Ce site a vocation à les référencer à moyen terme.</p>
          <p>En attendant, <strong>contactez votre mairie ou votre EPCI</strong>, et parlez-leur de nous !</p>
          <SearchCommuneContact />
        </SectionText>
      </Section>

      <Section title='En tant qu’utilisateur des données'>
        <div style={{textAlign: 'center'}}>
          <p style={{margin: '3em 0'}}>Vous utilisez les données diffusées par ce site et vous avez identifié des anomalies récurrentes sur une typologie d’adresse particulière ou dans une zone ?</p>
          <ButtonLink href='mailto:adresse@data.gouv.fr' isExternal>
            Contactez-nous
            <Mail style={{verticalAlign: 'bottom', marginLeft: '4px'}} />
          </ButtonLink>
        </div>
      </Section>

      <style jsx>{`
        .warning {
          color: ${theme.warningBorder};
          background: ${theme.warningBg};
          border: 1px solid ${theme.warningBorder};
          padding: 0px 20px;
          margin: 20px auto;
        }
      `}</style>
    </Page>
  )
}

export default Contribuer
