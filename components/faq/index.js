import React from 'react'
import Link from 'next/link'

import Section from '../section'
import Question from './question'

const About = () => (
  <Section>
    <div className='row'>
      <h3>Données nationales</h3>
      <Question
        question='La Base Adresse Nationale contient-elle des données personnelles ?'
      >
        <p>Non, cette base ne fait que référencer l’existence et la localisation géographique d’une adresse. Aucune information personnelle ne figure dans cette base de données.</p>
      </Question>

      <h3>API</h3>
      <Question
        question='Quelle est la licence des données proposées par l’API de géocodage ?'
      >
        <p>Les données utilisées par <Link href='/api'><a>l’API disponible sur ce site</a></Link> sont celles sous licence ODbL.</p>
      </Question>

      <Question
        question='Quelle sont les limitations en vigueur sur l’API de géocodage ?'
      >
        <>
          <h3>Quelle sont les limitations en vigueur sur l’API de géocodage ?</h3>
          <p>Les appels sont limités à :</p>
          <ul>
            <li>10 requêtes par seconde et par IP pour le géocodage simple ;</li>
            <li>1 requête simultanée par IP pour le géocodage de masse.</li>
          </ul>
        </>
      </Question>

      <style jsx>{`
      .row {
        display: flex;
        flex-direction: column;
      }
      `}</style>
    </div>
  </Section>
)

export default About
