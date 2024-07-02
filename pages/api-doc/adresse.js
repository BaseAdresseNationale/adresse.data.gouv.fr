import {Compass, Search} from 'react-feather'
import PropTypes from 'prop-types'
import Page from '@/layouts/main'
import Head from '@/components/head'
import TechnicalDoc from '@/components/api-doc/api-adresse/technical-doc'
import doc from '@/components/api-doc/api-adresse/doc'
import ByAddressName from '@/components/api-doc/api-adresse/examples/by-address-name'
import CurlDoc from '@/components/api-doc/api-adresse/curl-doc'
import Section from '@/components/section'
import {fetchLastUpdatedDate} from '@/lib/updated-date.js'

const title = 'API Adresse'
const description = 'Cherchez des adresses et lieux-dits.'

const examples = [
  {title: 'Recherche par texte', id: 'text', icon: <Search alt='' aria-hidden='true' />}
]

export async function getServerSideProps() {
  const lastUpdatedDate = await fetchLastUpdatedDate()
  return {
    props: {
      lastUpdatedDate
    }
  }
}

function Adresse({lastUpdatedDate}) {
  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<Compass color='white' size={56} alt='' aria-hidden='true' />}>
        {description}
      </Head>

      {lastUpdatedDate && (
        <div className='last-updated-container'>
          <span className='last-updated'>
            <b>Dernière actualisation du moteur de recherche : {lastUpdatedDate} </b>
          </span>
        </div>
      )}
      <Section background='grey'>
        <div>
          <p>
            L’API adresse permet notamment d’effectuer rapidement une recherche d’adresse, mais aussi de pouvoir associer des coordonnées à une adresse (&quot;géocoder&quot;) selon plusieurs critères. On vous explique tout en détail ici : <a href='https://guides.data.gouv.fr/reutiliser-des-donnees/utiliser-les-api-geographiques/utiliser-lapi-adresse' target='_blank' rel='noreferrer'>Guide sur l’API Adresse</a>
          </p>
          <p>Vous atteignez fréquemment la limite de requête de l’API, fixée à 50 appels / seconde/ IP ?</p>
          <p>2 options s’offrent à vous :</p>
          <ul>
            <li>Vous pouvez installer une instance de l’API sur vos propres serveurs. Nous vous indiquons la marche à suivre sur cette page : <a href='https://github.com/BaseAdresseNationale/addok-docker#installer-une-instance-avec-les-données-de-la-base-adresse-nationale' target='_blank' rel='noreferrer'>Installer une instance docker avec les données de la BAN</a></li>
            <li>Vous êtes un acteur public <b>ET</b> vous ne pouvez pas installer d’instance sur votre Système d’Information : vous pouvez demander une levée de cette limite au moyen de cette Démarche Simplifiée : <a href='https://www.demarches-simplifiees.fr/admin/procedures/75659/apercu' target='_blank' rel='noreferrer'>Demander une levée de limite</a></li>
          </ul>
        </div>

      </Section>

      <CurlDoc />

      <TechnicalDoc {...doc} />

      <ByAddressName {...examples[0]} />
      <style jsx>{`
        .last-updated-container {
          background-color: #0053b3;
          padding: 0px ;
          text-align: center;
        }
        .last-updated {
          color: white;
          font-size: 1em;
          
        }
      `}</style>

    </Page>
  )
}

Adresse.defaultProps = {
  lastUpdatedDate: null
}

Adresse.propTypes = {
  lastUpdatedDate: PropTypes.string,
}

export default Adresse
