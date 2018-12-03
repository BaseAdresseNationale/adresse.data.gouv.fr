import React from 'react'
import Link from 'next/link'
import FaPencil from 'react-icons/lib/fa/pencil'
import FaExternalLink from 'react-icons/lib/fa/external-link'
import FaMagic from 'react-icons/lib/fa/magic'

import Page from '../layouts/main'
import theme from '../styles/theme'

import Head from '../components/head'
import Section from '../components/section'
import ButtonLink from '../components/button-link'

const title = 'Contribuer'
const description = 'Les différents outils à votre disposition pour contribuer au contenu de la BAN.'

export default () => (
  <Page title={title} description={description}>
    <Head title={title} icon={<FaPencil />} />
    <Section title='En tant que collectivité locale'>
      <section className='option'>
        <h3>Créer une Base Adresse Locale</h3>
        <p>Si vous souhaitez maîtriser pleinement la gestion de vos adresses, la mise en place d’une Base Adresse Locale est l’approche à privilégier.<br />Il s’agit de la méthode recommandée par l’AMF et l’AITF.</p>
        <p>Des nombreux outils sont là pour vous aider.</p>
        <Link href='/bases-locales'><ButtonLink><FaMagic /> Accéder à la page dédiée</ButtonLink></Link>
      </section>

      <section className='option'>
        <h3>Utiliser le Guichet Adresse de l’IGN et de La Poste</h3>
        <p>Cet outil est destiné plus particulièrement aux mairies qui souhaitent avoir une assistance renforcée. Le processus est plus guidé, et vous n’avez aucun fichier à gérer.</p>
        <div className='warning'>
          <p>⚠ Attention : si vous souhaitez que les adresses de votre collectivité soient <strong>utilisables par le plus grand nombre</strong>, vous devez les publier sous <strong>Licence Ouverte</strong>.</p>
          <p>Un formulaire sera très bientôt disponible pour vous permettre de le faire en quelques clics.<br />D’ici là, le plus simple est encore de <a href='mailto:adresse@data.gouv.fr'>nous contacter</a> et nous réaliserons cette action à votre place.</p>
        </div>
        <ButtonLink href='https://guichet-adresse.ign.fr'><FaExternalLink /> Accéder au Guichet Adresse</ButtonLink>
      </section>
    </Section>

    <Section title='En tant que citoyen' background='grey'>
      <p>Il n’existe pas encore de <strong>dispositif national</strong> permettant aux citoyens de contribuer directement, mais de nombreux guichets de signalement existent à l’échelon local. Ce site a vocation à les référencer à moyen terme.</p>
      <p>En attendant, <strong>contactez votre mairie ou votre EPCI</strong>, et parlez-leur de nous !</p>
    </Section>

    <Section title='En tant qu’utilisateur des données'>
      <p>Vous utilisez les données diffusées par ce site et vous avez identifié des anomalies récurrentes sur une typologie d’adresse particulière ou dans une zone, <a href='mailto:adresse@data.gouv.fr'>contactez-nous</a>.</p>
    </Section>
    <style jsx>{`
      .option {
        margin: 70px auto;
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
