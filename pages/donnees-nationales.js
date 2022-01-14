import Link from 'next/link'
import Image from 'next/image'
import {Download} from 'react-feather'

import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import Card from '@/components/card'
import Intro from '@/components/donnees-nationales/intro'
import SectionText from '@/components/section-text'

const title = 'Données nationales'
const description = 'Fichiers nationaux contenant les adresses du territoire.'

function DonneesNatioales() {
  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<Download size={56} />} />
      <Section title='Base Adresse Nationale' subtitle='Base de données de référence pour les adresses en France'>
        <Intro />
      </Section>

      <Section background='grey' title='Télécharger les données'>
        <div className='card-container'>
          <Card
            title='Format CSV'
            link='https://adresse.data.gouv.fr/data/ban/adresses/latest/csv'
            description='Fichier d’usage général recommandé dans la majorité des cas'
            list={['1 position par adresse']}
            links={[{title: 'Schéma des données', href: 'https://github.com/etalab/adresse.data.gouv.fr/blob/master/public/schemas/adresses-csv.md'}]}
          />

          <Card
            title='Format Addok'
            link='https://adresse.data.gouv.fr/data/ban/adresses/latest/addok'
            description='Fichier spécifique pour le géocodeur Addok'
            list={['1 position par adresse']}
          />

          <Card
            title='Format JSON expert'
            description='Fichier contenant l’intégralité des données et métadonnées contenues dans la plateforme'
            list={['Plusieurs positions par adresse', 'Plusieurs sources par adresse']}
          />
        </div>
      </Section>

      <Section title='Comment est construite la Base Adresse Nationale ?' background='color'>

        <SectionText color='secondary'>
          <div>
            La Base Adresse Nationale est <b>constituée commune par commune</b>, sur le principe suivant :
            <ul>
              <li>si la commune dispose d’une <Link href='/bases-locales'><a>Base Adresse Locale</a></Link>, ce sont ces adresses qui sont incluses dans la Base Adresse Nationale ;</li>
              <li>dans le cas contraire, la liste des adresses est générée par défaut à partir des <b>meilleures sources disponibles</b> (DGFiP, IGN, ARCEP, Guichet Adresse).</li>
            </ul>
          </div>
        </SectionText>
        <div className='adjust-img'>
          <Image width={800} height={500} src='/images/donnees-nationales/schema-donnees-ban.png' alt='Schéma représentant les sources de données présentes dans la Base Adresse Nationale' />
        </div>
      </Section>

      <Section title='Autres fichiers nationaux' background='grey'>
        <div className='card-container'>
          <Card
            title='Export de l’API de gestion IGN'
            link='https://adresse.data.gouv.fr/data/ban/export-api-gestion/latest/'
            description='Ce fichier contient toutes les données que l’IGN exporte chaque semaine de son API de gestion d’adresses.'
          />

          <Card
            title='Adresses extraites du cadastre'
            link='https://www.data.gouv.fr/fr/datasets/adresses-extraites-du-cadastre/'
            action='Voir sur data.gouv.fr'
            description='Ce jeu de données contient toutes les adresses extraites des fichiers du cadastre (plan et fichier des parcelles bâties).'
          />
        </div >
      </Section >

      <style jsx>{`
        .card-container {
          margin-top: 3em;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
        }
      `}</style>
    </Page >
  )
}

export default DonneesNatioales
