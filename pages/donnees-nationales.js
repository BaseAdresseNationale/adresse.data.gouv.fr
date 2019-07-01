import React from 'react'
import Link from 'next/link'
import DownloadIcon from 'react-icons/lib/fa/download'
import Page from '../layouts/main'

import Head from '../components/head'
import Section from '../components/section'
import Notification from '../components/notification'

import theme from '../styles/theme'

const title = 'Données nationales'
const description = 'Fichiers nationaux contenant les adresses du territoire.'

export default () => (
  <Page title={title} description={description}>
    <Head title={title} icon={<DownloadIcon />} />

    <Notification fullWidth>
      Conformément à la <a href='https://www.ccomptes.fr/sites/default/files/2019-03/20190311-refere-S2018-3287-valorisation-donnees-IGN-Meteo-France-Cerema-rep-PM.pdf'>demande du Premier Ministre</a>, la Base Adresse Nationale passera sous <strong>Licence Ouverte</strong> au plus tard le <strong style={{textDecoration: 'underline'}}>1er janvier 2020</strong>.
    </Notification>

    <Section title='Base Adresse Nationale' subtitle='Données de référence issues d’une coopération entre l’État, l’IGN, La Poste et OpenStreetMap France' >
      <div style={{textAlign: 'center'}}>
        <p>Les données listées ci-dessous sont issues du rapprochement des données et traitements adresses des partenaires de la BAN.</p>
        <p>Elles <strong>peuvent être téléchargées gratuitement</strong>,
        et sont <strong>disponibles sous deux formes</strong>.</p>
      </div>

      <div className='datasets'>
        <div className='dataset'>
          <h3>Produit gratuit issu de la BAN</h3>

          <div className='divider' />

          <p className='block description'>
            Export des données de l’API de gestion de la Base Adresse Nationale.
          </p>

          <div className='block characteristics'>
            <h6>Caractéristiques</h6>
            <ul>
              <li>Producteur : <strong>IGN</strong></li>
              <li>Licence : <a href='/static/docs/licence-produit-gratuit-ban.pdf'>licence spécifique</a></li>
              <li>Fréquence de mise à jour : <strong>hebdomadaire</strong></li>
              <li>Identifiant : <strong>identifiant technique de l’API de gestion</strong></li>
            </ul>
            <ul>
              <li><strong>1 ligne par position</strong></li>
              <li>Table de passage identifiants IGN vers identifiants API</li>
            </ul>
          </div>

          <div className='block downloads'>
            <h6>Télécharger les données</h6>
            <ul>
              <li><a href='/data/ban/export-api-gestion/latest/'>Format CSV (3 fichiers)</a> <span className='new'>Nouveau !</span></li>
            </ul>
          </div>

          <div className='infos block' />

          <Notification type='warning'>
            NB : La licence du produit gratuit issu de la BAN est homologuée jusqu’au 31 décembre 2019.
          </Notification>
        </div>

        <div className='dataset'>
          <h3>Adresses ODbL</h3>

          <div className='divider' />

          <p className='block description'>
            Données prêtes à l’emploi, issues de la Base Adresse Nationale, retravaillées et enrichies des <Link href='/bases-locales'><a>Bases Adresses Locales</a></Link>
          </p>

          <div className='block characteristics'>
            <h6>Caractéristiques</h6>
            <ul>
              <li>Producteur : <strong>Etalab</strong></li>
              <li>Licence : <a href='https://opendatacommons.org/licenses/odbl/summary/'>Open Database License (ODbL) 1.0</a></li>
              <li>Fréquence de mise à jour : <strong>hebdomadaire</strong></li>
              <li>Identifiant : <strong>clé d’interopérabilité</strong></li>
            </ul>
            <ul>
              <li><strong>1 ligne par adresse</strong></li>
              <li>Environ 23,4 millions d’adresses</li>
              <li>Libellés normalisés AFNOR</li>
              <li>&nbsp;</li>
              <li>Utilisé par le géocodeur adresse.data.gouv.fr <span className='soon'>Bientôt</span></li>
              <li>Lien avec la parcelle cadastrale <span className='soon'>Bientôt</span></li>
            </ul>
          </div>

          <div className='block downloads'>
            <h6>Télécharger les données</h6>
            <ul>
              <li><a href='/data/ban/adresses-odbl/latest/csv'>Format CSV</a> <span className='new'>Amélioré !</span></li>
              <li>Exports historiques OSM <span className='soon'>Bientôt</span></li>
            </ul>
          </div>
        </div>

      </div>
    </Section>

    <Section title='En partenariat avec'>
      <div className='partners'>
        <div>
          <a href='https://portail.dgfip.finances.gouv.fr/portail/accueilIAM.pl/'>
            <img className='logo' src='/static/images/logos/dgfip.png' alt='DGFIP' />
          </a>
        </div>
        <div>
          <a href='http://ign.fr/'>
            <img className='logo' src='/static/images/logos/IGN.jpg' alt='IGN' />
          </a>
        </div>
        <div>
          <a href='http://openstreetmap.fr/'>
            <img className='logo' src='/static/images/logos/OSM.png' alt='OpenStreetMap France' />
          </a>
        </div>
        <div>
          <a href='http://www.laposte.fr/'>
            <img className='logo' src='/static/images/logos/laposte.jpg' alt='La Poste' />
          </a>
        </div>
      </div>
    </Section>

    <style jsx>{`
        .donnees-nationales-section {
          margin: 2em 0;
        }

        .datasets {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          grid-gap: 2em;
          margin-top: 2em;
          justify-content: center;
        }

        .row {
          display: flex;
          justify-content: space-between;
          flex-flow: wrap;
          margin-bottom: 20px;
        }

        .row ul {
          list-style: circle;
        }

        .alert {
          border: 1px solid gray;
          padding: 20px;
        }

        @media (min-width: 900px) {
          .row > div {
            width: 48%;
          }
        }

        .partners {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          grid-row-gap: 0.6em;
          text-align: center;
          align-items: center;
        }

        .logo {
          height: 130px;
        }

        .dataset {
          display: flex;
          flex-direction: column;
          text-align: center;
          padding: 1em;
          box-shadow: 0 1px 4px 0 ${theme.boxShadow};
        }

        .dataset ul {
          display: flex;
          flex-direction: column;
          align-items: center;
          list-style-type: none;
          padding: 0;
        }

        .block {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          min-height: 40px;
          margin: 1em 0;
        }

        .general {
          display: flex;
          align-items: center;
          flex-flow: wrap;
        }

        .general div {
          display: flex;
          flex-wrap: nowrap;
          margin: 0.3em;
          align-items: center;
        }

        .divider {
          border-bottom: 4px solid ${theme.primary};
          margin: 1em;
        }

        .new {
          color: ${theme.successBorder}
        }

        .soon {
          color: ${theme.primary}
        }

        h6 {
          margin-bottom: 1em;
        }
      `}</style>
  </Page>
)
