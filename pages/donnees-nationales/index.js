import Link from 'next/link'
import Image from 'next/legacy/image'
import {Download} from 'react-feather'

import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import Card from '@/components/card'
import Intro from '@/components/donnees-nationales/intro'
import SectionText from '@/components/section-text'

const title = 'Données nationales'
const description = 'Fichiers nationaux contenant les adresses du territoire.'

function DonneesNationales() {
  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<Download size={56} alt='' aria-hidden='true' />} />
      <Section title='Base Adresse Nationale' subtitle='Base de données de référence pour les adresses en France'>
        <Intro />
      </Section>

      <Section background='grey' title='Télécharger les données'>
        <div className='card-container'>
          <Card
            title='Format CSV historique'
            link='/data/ban/adresses/latest/csv'
            action='Télécharger au format CSV'
            list={['1 position par adresse']}
            links={[{title: 'Schéma des données', href: 'https://github.com/etalab/adresse.data.gouv.fr/blob/master/public/schemas/adresses-csv.md'}]}
          >
            Fichier d’usage général recommandé dans la majorité des cas
          </Card>

          <Card
            title='Format BAL'
            list={['Plusieurs positions par adresse']}
            link='/data/ban/adresses/latest/csv-bal/'
            action='Téléchargez au format BAL'
          >
            Fichier CSV au format <a href='https://aitf-sig-topo.github.io/voies-adresses/files/AITF_SIG_Topo_Format_Base_Adresse_Locale_v1.3.pdf'>BAL 1.3 (AITF)</a>
          </Card>

          <Card
            title='Format Addok'
            link='/data/ban/adresses/latest/addok'
            action='Télécharger au format Addok'
            list={['1 position par adresse']}
          >
            Fichier spécifique pour le géocodeur Addok
          </Card>
        </div>
      </Section>

      <Section background='grey' title='Services cartographiques'>
        <div className='card-container'>
          <Card
            title='Format MVT (tuiles vectorielles)'
            link='https://github.com/BaseAdresseNationale/ban-plateforme/wiki/Tuiles-vectorielles'
            action='Consulter la documentation MVT'
            list={['Mise à jour en temps réel', '1 position par adresse']}
          >
            Visualisation cartographique des adresses BAN en tuiles vectorielles
          </Card>

          <Card
            title='Format WFS'
            link='https://geoservices.ign.fr/services-web-experts-adresse'
            action='Consulter la documentation WFS'
            list={['Mise à jour mensuelle', 'Nom de la couche : BAN.DATA.GOUV:ban', '1 position par adresse']}
          >
            Visualisation cartographique des adresses BAN en WFS
          </Card>

          <Card
            title='Format WMS'
            link='https://geoservices.ign.fr/services-web-experts-adresse'
            action='Consulter la documentation WMS'
            list={['Mise à jour mensuelle', 'Nom de la couche : BAN.DATA.GOUV', '1 position par adresse']}
          >
            Visualisation cartographique des adresses BAN en WMS
          </Card>
        </div>
        <div className='link'>
          <a href='https://geoservices.ign.fr/documentation/services/utilisation-sig' target='_blank' rel='noreferrer'>
            Retrouvez les tutoriels d’utilisation des flux avec un outil SIG
          </a>
        </div>
      </Section>

      <Section title='Comment est construite la Base Adresse Nationale ?' background='color'>
        <SectionText color='secondary'>
          <div>
            La Base Adresse Nationale est <b>constituée commune par commune</b>, sur le principe suivant :
            <ul>
              <li>si la commune dispose d’une <Link href='/bases-locales' legacyBehavior><a>Base Adresse Locale</a></Link>, ce sont ces adresses qui sont incluses dans la Base Adresse Nationale ;</li>
              <li>dans le cas contraire, la liste des adresses est générée par défaut à partir des <b>meilleures sources disponibles</b> (DGFiP, IGN, ARCEP, Guichet Adresse).</li>
            </ul>
          </div>
        </SectionText>
        <div className='adjust-img'>
          <Image width={1000} height={600} src='/images/donnees-nationales/schema-donnees-ban.svg' alt='' aria-hidden='true' />
        </div>
      </Section>

      <Section title='Autres fichiers nationaux' background='grey'>
        <div className='card-container'>

          <Card
            title='Adresses extraites du cadastre'
            link='https://www.data.gouv.fr/fr/datasets/adresses-extraites-du-cadastre/'
            action='Voir sur data.gouv.fr'
          >
            Ce jeu de données contient toutes les adresses extraites des fichiers du cadastre (plan et fichier des parcelles bâties).
          </Card>
        </div >
      </Section >

      <style jsx>{`
        .card-container {
          margin-top: 3em;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
          gap: 1em;
        }
        .adjust-img {
          text-align: center;
        }
        .link {
          text-align: center;
          padding-top: 3em;
        }
      `}</style>
    </Page >
  )
}

export default DonneesNationales
