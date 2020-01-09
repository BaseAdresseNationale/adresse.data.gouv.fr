import React from 'react'
import Link from 'next/link'
import {Download} from 'react-feather'

import Page from '../layouts/main'

import Head from '../components/head'
import Section from '../components/section'
import Container from '../components/container'
import Notification from '../components/notification'

import theme from '../styles/theme'

const title = 'Données nationales'
const description = 'Fichiers nationaux contenant les adresses du territoire.'

export default () => (
  <Page title={title} description={description}>
    <Head title={title} icon={<Download size={56} />} />

    <Notification isFullWidth>
      Conformément à la <a href='https://www.ccomptes.fr/sites/default/files/2019-03/20190311-refere-S2018-3287-valorisation-donnees-IGN-Meteo-France-Cerema-rep-PM.pdf'>décision du Premier Ministre</a>, la Base Adresse Nationale est disponible intégralement sous <strong>Licence Ouverte</strong> depuis le <strong style={{textDecoration: 'underline'}}>1er janvier 2020</strong>.
    </Notification>

    <Section>
      <div className='datasets'>

        <div className='dataset'>
          <h3>Produit gratuit issu de la BAN</h3>

          <div className='divider' />

          <p className='block description'>
            Export brut des données de l’API de gestion IGN
          </p>

          <div className='block characteristics'>
            <h6>Caractéristiques</h6>
            <ul>
              <li>Producteur : <strong>IGN</strong></li>
              <li>Licence : <a href='https://www.etalab.gouv.fr/licence-ouverte-open-licence'>Licence Ouverte</a></li>
              <li>Fréquence de mise à jour : <strong>hebdomadaire</strong></li>
            </ul>
            <ul>
              <li><strong>1 ligne par position et par source</strong></li>
              <li>49 millions de lignes</li>
              <li>Table de passage identifiants IGN</li>
            </ul>
            <p><a href='/docs/BAN_Descriptif_Donnees.pdf'>Documentation produit</a></p>
          </div>

          <div className='block downloads'>
            <h6>Télécharger les données</h6>
            <ul>
              <li><a href='/data/ban/export-api-gestion/latest/'>Format CSV (3 fichiers)<span className='icon'><Download size={16} /></span></a></li>
            </ul>
          </div>
        </div>

        <div className='dataset'>
          <h3>Adresses</h3>

          <div className='divider' />

          <p className='block description'>
            Adresses normalisées issues des <Link href='/bases-locales'><a>Bases Adresses Locales</a></Link>, de l’API de gestion IGN et de sources complémentaires.
          </p>

          <div className='block characteristics'>
            <h6>Caractéristiques</h6>
            <ul>
              <li>Producteur : <strong>Etalab</strong></li>
              <li>Licence : <a href='https://www.etalab.gouv.fr/licence-ouverte-open-licence'>Licence Ouverte</a></li>
              <li>Fréquence de mise à jour : <strong>hebdomadaire</strong></li>
            </ul>
            <ul>
              <li><strong>1 ligne par adresse</strong></li>
              <li>24,6 millions d’adresses</li>
              <li>200 000 lieux-dits (<span className='new'>beta</span>)</li>
              <li>Contient les libellés normalisés AFNOR</li>
            </ul>
            <p><a href='https://github.com/etalab/adresse.data.gouv.fr/blob/master/public/schemas/adresses-csv.md'>Schéma des données</a></p>
          </div>

          <div className='block downloads'>
            <h6>Télécharger les données</h6>
            <ul>
              <li><a href='/data/ban/adresses-odbl/latest/csv'>Format CSV<span className='icon'><Download size={16} /></span></a></li>
              <li><a href='/data/ban/adresses-odbl/latest/addok'>Format JSON pour Addok<span className='icon'><Download size={16} /></span></a></li>
            </ul>
          </div>
        </div>

      </div>
    </Section>

    <Section title='Quelles données retrouve-t-on dans chacun de ces fichiers ?'>
      <Container>
        <p>Les schémas suivant décrivent de façon succinctes les sources de données mobilisées dans les différents fichiers.</p>
        <h5>Produit gratuit issu de la BAN</h5>
        <img className='adjust-img' src='/images/donnees-nationales/schema-export-api-gestion.png' alt='Schéma représentant les sources de données présentes dans le fichier produit gratuit issu de la BAN' />
        <h5>Adresses</h5>
        <img className='adjust-img' src='/images/donnees-nationales/schema-adresses.png' alt='Schéma représentant les sources de données présentes dans le fichier Adresses' />
      </Container>
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

        .description {
          font-size: 0.9em;
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
          align-items: center;
          justify-content: center;
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

        .adjust-img {
          width: 100%;
          height: auto;
          max-width: 600px;
          margin: 50px;
        }

        .icon {
          vertical-align: sub;
          margin-left: 5px;
        }
      `}</style>
  </Page>
)
