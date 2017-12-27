import Link from 'next/link'

import theme from '../styles/theme'

import Section from './section'
import Head from './head'

const Tools = () => (
  <div>
    <Head title='Outils' icon='/static/images/icons/tools.svg'>
      <div>
        <p><strong>adresse.data.gouv.fr</strong> met en place des outils pour une prise en main rapide des données adresses ouvertes.</p>
      </div>
    </Head>
    <Section>
      <div className='row'>

        <div className='tool'>
          <img src='/static/images/icons/map.svg' alt='map' />
          <div>
            <h2><Link href='/map'><a>La carte interactive</a></Link></h2>
            <p>Cherchez des adresses et lieux-dits, zoomez et déplacez la carte pour faire un géocodage inversé…</p>
          </div>
        </div>

        <div className='tool'>
          <img src='/static/images/icons/csv-grey.svg' alt='csv' />
          <div>
            <h2><Link href='/csv'><a>Le géocodeur CSV</a></Link></h2>
            <p>Uploadez un fichier CSV, définissez les colonnes à utiliser pour le géocodage…</p>
          </div>
        </div>

        <div className='tool'>
          <img src='/static/images/icons/api-grey.svg' alt='api' />
          <div>
            <h2><Link href='/api'><a>L’API</a></Link></h2>
            <p>Géocodez vos adresses grâce à l’API en ligne…</p>
          </div>
        </div>

      </div>
      <div>
        <p>Tous ces outils sont sous licences libres.</p>
        <p>Les données de référence utilisées par l’API sont sous licence ODbL. <Link href='/faq'><a>En savoir plus…</a></Link></p>
      </div>
    </Section>
    <style jsx>{`
      .row {
        display: flex;
        flex-flow: column;
      }

      .tool {
        display: flex;
        align-items: center;
      }

      .tool a {
        color: ${theme.darkText};
      }

      .tool img {
        width: 50px;
        margin-right: 1em;
      }
      `}</style>
  </div>
)

export default Tools
