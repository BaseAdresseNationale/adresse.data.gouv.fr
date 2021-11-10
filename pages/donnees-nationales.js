import Link from 'next/link'
import Image from 'next/image'
import {Download} from 'react-feather'

import theme from '@/styles/theme'
import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import Card from '@/components/card'
import BanSearch from '@/components/ban-search'
import Intro from '@/components/donnees-nationales/intro'

const title = 'Données nationales'
const description = 'Fichiers nationaux contenant les adresses du territoire.'

function DonneesNatioales() {
  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<Download size={56} />} />
      <Section title='Rechercher les adresses d’une commune' subtitle='Rechercher une adresse, une voie, un lieu-dit ou une commune dans la Base Adresse Nationale.'>
        <div className='searchbar'>
          <BanSearch />
        </div>
      </Section>

      <Section title='Base Adresse Nationale' subtitle='Base de données de référence pour les adresses en France' background='grey'>
        <Intro />
      </Section>

      <Section background='grey' title='Télécharger les données'>
        <div className='card-container'>
          <Card title='Format CSV' link='https://adresse.data.gouv.fr/data/ban/adresses/latest/csv'>
            <div className='card-text'>
              Fichier d’usage général recommandé dans la majorité des cas
            </div>
            <div className='card-list'>
              <div>1 position par adresse</div>
            </div>

            <div className='card-links'>
              <a href='https://github.com/etalab/adresse.data.gouv.fr/blob/master/public/schemas/adresses-csv.md'>Schéma des données</a>
            </div>
          </Card>
          <Card title='Format Addok' link='https://adresse.data.gouv.fr/data/ban/adresses/latest/addok'>
            <div className='card-text'>
              Fichier spécifique pour le géocodeur Addok
            </div>
            <div className='card-list'>
              <div>1 position par adresse</div>
            </div>
          </Card>
          <Card title='Format JSON expert'>
            <div className='card-text'>
              Fichier contenant l’intégralité des données et métadonnées contenues dans la plateforme
            </div>
            <div className='card-list'>
              <div>Plusieurs positions par adresse</div>
              <div>Plusieurs sources par adresse</div>
            </div>
          </Card>
        </div>
      </Section>
      <Section title='Comment est construite la Base Adresse Nationale ?' background='color'>
        <p>
          La Base Adresse Nationale est <b>constituée commune par commune</b>, sur le principe suivant :
          <ul>
            <li>si la commune dispose d’une <Link href='/bases-locales'><a>Base Adresse Locale</a></Link>, ce sont ces adresses qui sont incluses dans la Base Adresse Nationale ;</li>
            <li>dans le cas contraire, la liste des adresses est générée par défaut à partir des <b>meilleures sources disponibles</b> (DGFiP, IGN, La Poste, ARCEP, Guichet Adresse, SDIS…).</li>
          </ul>
        </p>

        <div className='adjust-img'>
          <Image width={1000} height={386} src='/images/donnees-nationales/schema-donnees-ban.svg' alt='Schéma représentant les sources de données présentes dans la Base Adresse Nationale' />
        </div>

      </Section>
      <Section title='Autres fichiers nationaux' background='grey'>
        <div className='card-container'>
          <Card title='Export de l’API de gestion IGN' link='https://adresse.data.gouv.fr/data/ban/export-api-gestion/latest/'>
            <div className='card-text'>
              Ce fichier contient toutes les données que l’IGN exporte chaque semaine de son API de gestion d’adresses.
            </div>
          </Card>
          <Card title='Adresses extraites du cadastre' link='https://www.data.gouv.fr/fr/datasets/adresses-extraites-du-cadastre/' action='Voir sur data.gouv.fr'>
            <div className='card-text'>
              Ce jeu de données contient toutes les adresses extraites des fichiers du cadastre (plan et fichier des parcelles bâties).
            </div>
          </Card>
        </div >
      </Section >
      <style jsx>{`
      .icon {
        vertical-align: sub;
        margin-left: 5px;
      }
      .section-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        margin: 1em 0;
      }
      .ban {
        display: flex;
        flex-direction: column;
        justify-content: start;
        flex: 2;
        margin: 1em;
        margin-right: 2em;
        min-width: 200px;
      }
      .characteristics {
        border: 1px solid whitesmoke;
        flex: 1;
        min-width: 200px;
        padding: 1.5em;
        margin: auto;
        margin-top: 1em;
        box-shadow: 0 1px 4px ${theme.boxShadow};
        border-radius: ${theme.borderRadius};
      }
      h6 {
        margin-bottom: 1em;
      }
      .card-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      }
      .card-container .title {
        font-weight: 600;
      }
      .card-text {
        height: 120px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        padding: .5em;
      }
      .card-list {
        font-weight: bold;
        display: grid;
        grid-columns: 1fr;
        grid-rows: 1fr 1fr;
        grid-gap: .2em;
        padding-bottom: .4em;
      }
      .card-links {
        display: grid;
        grid-columns: 1fr;
        grid-rows: 1fr 1fr;
        grid-gap: .2em;
        padding-bottom: .4em;
      }
      .new {
        color: ${theme.successBorder}
      }
      .adjust-img {
        display: flex;
        justify-content: center;
        margin: 1em;
      }
      `}</style>
    </Page >
  )
}

export default DonneesNatioales
