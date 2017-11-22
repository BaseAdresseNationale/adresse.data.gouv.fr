import Link from 'next/link'

import Section from './section'
import Head from './head'

const About = () => (
  <div>
    <Head title='Foire aux questions' icon='/static/images/icons/faq.svg'>
      <div><p>En savoir plus sur <strong>adresse.data.gouv.fr</strong>.</p></div>
    </Head>
    <Section>
      <div className='row'>
        <div className='prose'>
          <h2>À propos du site</h2>
          <h3>À quoi sert ce site ?</h3>
          <p>Ce site est destiné à :</p>
          <ul>
            <li>fournir de l’information sur la Base Adresse Nationale,</li>
            <li>accéder aux données composant cette base (téléchargement),</li>
            <li>fournir des outils et services en ligne pour utiliser les données (géocodage),</li>
            <li>ainsi que pour contribuer à l’amélioration de son contenu.</li>
          </ul>
          <h3>Qui gère ce site ?</h3>
          <p>Le site adresse.data.gouv.fr est géré par la mission Etalab de la DINSIC.</p>

          <h2>Les données</h2>

          <h3>La Base Adresse Nationale contient-elle des données personnelles ?</h3>
          <p>Non, cette base ne fait que référencer l’existence et la localisation géographique d’une adresse. Aucune information personnelle ne figure dans cette base de données.</p>

          <h3>Comment signaler une erreur ou un manque dans les données ?</h3>
          <p>L’outil de signalement d’erreur est en cours de développement.<br />En attendant son ouverture, vous pouvez signaler une erreur avec l’outil <a href='https://espacecollaboratif.ign.fr/'>Espace Collaboratif de l’IGN</a> ou auprès du <a href='http://www.laposte.fr/sna'>Service National de l’Adresse</a> de La Poste.</p>

        </div>
        <div>
          <h2>Quelle est la licence des données proposées par l’API de géocodage ?</h2>
          <p>Les données utilisées par <Link href='/api'><a>l’API disponible sur ce site</a></Link> sont celles sous licence ODbL.</p>

          <h2>Quelle sont les limitations en vigueur sur l’API de géocodage ?</h2>
          <p>Les appels sont limités à :</p>
          <ul>
            <li>10 requêtes par seconde et par IP pour le géocodage simple ;</li>
            <li>1 requête simultanée par IP pour le géocodage de masse.</li>
          </ul>
        </div>
      </div>
    </Section>
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
  </div>
)

export default About
