import React from 'react'
import FaPencil from 'react-icons/lib/fa/pencil'
import FaExternalLink from 'react-icons/lib/fa/external-link'
import FaMagic from 'react-icons/lib/fa/magic'

import Page from '../layouts/main'
import theme from '../styles/theme'

import Head from '../components/head'
import Section from '../components/section'
import ButtonLink from '../components/button-link'
import Notification from '../components/notification'

const title = 'Contribuer'
const description = 'Les différents outils à votre disposition pour contribuer à améliorer les données Adresse.'

export default () => (
  <Page title={title} description={description}>
    <Head title={title} icon={<FaPencil />} />
    <Section title='En tant que collectivité locale'>
      <div className='collectivites'>
        <section>
          <h3>Créer une Base Adresse Locale</h3>
          <p>Si vous souhaitez maîtriser pleinement la gestion de vos adresses, la mise en place d’une Base Adresse Locale est l’approche à privilégier.<br />Il s’agit de la méthode recommandée par l’AMF et l’AITF.</p>
          <p>Des nombreux outils sont là pour vous aider.</p>
          <ButtonLink href='/bases-locales'><FaMagic /> Accéder à la page dédiée</ButtonLink>
        </section>

        <section>
          <h3>Utiliser le Guichet Adresse de l’IGN et de La Poste</h3>
          <p>Cet outil est destiné plus particulièrement aux mairies qui souhaitent avoir une assistance renforcée. Le processus est plus guidé, et vous n’avez aucun fichier à gérer.</p>
          <ButtonLink href='https://guichet-adresse.ign.fr'><FaExternalLink /> Accéder au Guichet Adresse</ButtonLink>
        </section>
      </div>
    </Section>

    <Section title='En tant que citoyen' background='grey'>
      <p>Il n’existe pas encore de <strong>dispositif national</strong> permettant aux citoyens de contribuer directement, mais de nombreux guichets de signalement existent à l’échelon local. Ce site a vocation à les référencer à moyen terme.</p>
      <p>En attendant, <strong>contactez votre mairie ou votre EPCI</strong>, et parlez-leur de nous !</p>
    </Section>

    <Section title='En tant qu’utilisateur des données'>
      <p>Vous utilisez les données diffusées par ce site et vous avez identifié des anomalies récurrentes sur une typologie d’adresse particulière ou dans une zone, <a href='mailto:adresse@data.gouv.fr'>contactez-nous</a>.</p>
    </Section>
    <style jsx>{`
      .collectivites {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
        grid-gap: 1em;
        margin-top: 2em;
      }

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
