import {Compass, Search} from 'react-feather'

import Page from '@/layouts/main'
import Head from '@/components/head'
import TechnicalDoc from '@/components/api-doc/api-adresse/technical-doc'
import doc from '@/components/api-doc/api-adresse/doc'
import ByAddressName from '@/components/api-doc/api-adresse/examples/by-address-name'
import CurlDoc from '@/components/api-doc/api-adresse/curl-doc'
import Section from '@/components/section'

const title = 'API Adresse'
const description = 'Cherchez des adresses et lieux-dits.'

const examples = [
  {title: 'Recherche par texte', id: 'text', icon: <Search alt='' aria-hidden='true' />}
]

function Adresse() {
  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<Compass color='white' size={56} alt='' aria-hidden='true' />}>
        {description}
      </Head>

      <Section background='grey'>
        <div>
          <p>
            L’API adresse permet notamment d’effectuer rapidement une recherche d’adresse, mais aussi de pouvoir associer des coordonnées à une adresse (&quot;géocoder&quot;) selon plusieurs critères. On vous explique tout en détail ici : <a href='https://guides.etalab.gouv.fr/apis-geo/1-api-adresse.html' target='_blank' rel='noreferrer'>Guide sur l’API Adresse</a>
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

    </Page>
  )
}

export default Adresse
