import Link from 'next/link'
import Image from 'next/image'
import {Download} from 'react-feather'

import apis from '../apis.json'

import theme from '@/styles/theme'
import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import Card from '@/components/card'
import Intro from '@/components/donnees-nationales/intro'
import BanSearch from '@/components/ban-search'
import DownloadData from '@/components/donnees-nationales/download-data'
import {Api} from '@/components/apis'

const title = 'Données nationales'
const description = 'Fichiers nationaux contenant les adresses du territoire.'

function DonneesNatioales() {
  const {userApis} = apis

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

      <Section title='Utilisez les outils de la Base Adresse Nationale'>
        <div className='apis-container'>
          {userApis.map(({title, description, links}) => <Api key={title} title={title} description={description} links={links} />)}
        </div>
      </Section>

      <Section background='grey' title='Télécharger les données'>
        <DownloadData />
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
          <Card
            title='Export de l’API de gestion IGN'
            href='https://adresse.data.gouv.fr/data/ban/export-api-gestion/latest/'
          >
            Ce fichier contient toutes les données que l’IGN exporte chaque semaine de son API de gestion d’adresses.
          </Card>

          <Card
            title='Adresses extraites du cadastre'
            href='https://www.data.gouv.fr/fr/datasets/adresses-extraites-du-cadastre/'
            action='Voir sur data.gouv.fr'
          >
            Ce jeu de données contient toutes les adresses extraites des fichiers du cadastre (plan et fichier des parcelles bâties).
          </Card>
        </div >
      </Section >

      <style jsx>{`
        .searchbar {
          margin-top: 3em;
        }

        .apis-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 4em;
          padding: 2em 0;
        }

        .card-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }

        .icon {
          vertical-align: sub;
          margin-left: 5px;
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
