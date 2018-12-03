import React from 'react'
import Link from 'next/link'

import Section from './section'

const About = () => (
  <Section>
    <div className='row'>
      <div className='prose'>
        <h3>La Base Adresse Nationale contient-elle des données personnelles ?</h3>
        <p>Non, cette base ne fait que référencer l’existence et la localisation géographique d’une adresse. Aucune information personnelle ne figure dans cette base de données.</p>

        <h3>Quelle est la licence des données proposées par l’API de géocodage ?</h3>
        <p>Les données utilisées par <Link href='/api'><a>l’API disponible sur ce site</a></Link> sont celles sous licence ODbL.</p>

        <h3>Quelle sont les limitations en vigueur sur l’API de géocodage ?</h3>
        <p>Les appels sont limités à :</p>
        <ul>
          <li>10 requêtes par seconde et par IP pour le géocodage simple ;</li>
          <li>1 requête simultanée par IP pour le géocodage de masse.</li>
        </ul>
      </div>
    </div>
    <style jsx>{`
      .row {
        display: flex;
      }

      .prose {
        font-size: 1.1em;
      }

      .prose ul {
        list-style: circle;
      }
      `}</style>
  </Section>
)

export default About
