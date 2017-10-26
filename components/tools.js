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
            <h2><a href='/map'>La carte interactive</a></h2>
            <p>Cherchez des adresses et lieux-dits, zoomez et déplacez la carte pour faire un géocodage inversé…</p>
          </div>
        </div>

        <div className='tool'>
          <img src='/static/images/icons/csv-grey.svg' alt='csv' />
          <div>
            <h2><a href='/csv'>Le géocodeur CSV</a></h2>
            <p>Uploadez un fichier CSV, définissez les colonnes à utiliser pour le géocodage…</p>
          </div>
        </div>

        <div className='tool'>
          <img src='/static/images/icons/api-grey.svg' alt='api' />
          <div>
            <h2><a href='/api'>L’API</a></h2>
            <p>Géocodez vos adresses grâce à l’API en ligne…</p>
          </div>
        </div>

      </div>
      <div>
        <p>Tous ces outils sont <a href='/foss'>sous licence libre</a>.</p>
        <p>Les données de référence utilisées par l’API sont sous licence ODbL. <a href='/faq'>En savoir plus…</a></p>
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

      .tool img {
        width: 50px;
        margin-right: 1em;
      }
      `}</style>
  </div>
)

export default Tools
