import React from 'react'
import Link from 'next/link'
import DownloadIcon from 'react-icons/lib/fa/download'
import Page from '../layouts/main'

import Head from '../components/head'
import Section from '../components/section'
import ButtonLink from '../components/button-link'
import Notification from '../components/notification'
import Container from '../components/container'

const title = 'Données nationales'
const description = 'Fichiers nationaux contenant les adresses du territoire.'

export default () => (
  <Page title={title} description={description}>
    <Head title={title} icon={<DownloadIcon />} />
    <Notification fullWidth>
      Conformément à la <a href='https://www.ccomptes.fr/sites/default/files/2019-03/20190311-refere-S2018-3287-valorisation-donnees-IGN-Meteo-France-Cerema-rep-PM.pdf'>demande du Premier Ministre</a>, la Base Adresse Nationale passera sous <strong>Licence Ouverte</strong> au plus tard le <strong style={{textDecoration: 'underline'}}>1er janvier 2020</strong>.
    </Notification>
    <Section title='Base Adresse Nationale' subtitle='Données de référence issues d’une coopération entre l’État, l’IGN, La Poste et OpenStreetMap France'>
      <div>
        <p>Les données listées ci-dessous sont issues du rapprochement des données et traitements adresses des partenaires de la BAN.</p>
        <p>Elles <strong>peuvent être téléchargées gratuitement</strong>,
        et sont <strong>disponibles sous deux formes</strong>.</p>
      </div>
    </Section>

    <Container>
      <div className='donnees-nationales-section'>
        <h3>Diffusion sous “licence du produit gratuit issu de la BAN”</h3>
        <div className='row'>
          <div>
            <h4>Résumé de la licence</h4>
            <p>La “licence du produit gratuit issu de la BAN” vous autorise à :</p>
            <ul>
              <li>copier, distribuer et utiliser la base de données ;</li>
              <li>produire des créations à partir de cette base de données ;</li>
              <li>modifier, transformer et construire à partir de cette base de données.</li>
            </ul>
            <p>Tant que :</p>
            <ul>
              <li>vous mentionnez la source des données ;</li>
              <li>vous transmettez aux partenaires BAN une copie électronique de tous les enrichissements réalisés.</li>
            </ul>
            <p>Pour plus d’informations, consultez le <a href='/static/docs/licence-produit-gratuit-ban.pdf'>texte de la licence.</a></p>
            <p style={{color: 'red'}}>NB : Cette licence est homologuée jusqu’au 31 décembre 2019.</p>
          </div>

          <div>
            <h4>Données</h4>
            <div>
              <div>
                <p>Pour connaître précisement le contenu de ces données, <Link href='https://github.com/etalab/adresse.data.gouv.fr/blob/master/static/schemas/ban-2015.md'><a>consultez le descriptif des données</a></Link>.</p>
                <p>Données en téléchargement pour un département, ou la France entière, et disponibles exclusivement au format CSV.</p>
                <ButtonLink href='/data/ban-v0'>
                  Accéder aux données
                </ButtonLink>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Container>

    <Container>
      <div className='donnees-nationales-section'>
        <h3>Diffusion alternative sous licence ODbL (assurée par OpenStreetMap France)</h3>
        <div className='row'>
          <div>
            <h4>Résumé de la licence</h4>
            <p>La licence ODbL vous autorise à :</p>
            <ul>
              <li>copier, distribuer et utiliser la base de données ;</li>
              <li>produire des créations à partir de cette base de données ;</li>
              <li>modifier, transformer et construire à partir de cette base de données.</li>
            </ul>
            <p>Tant que :</p>
            <ul>
              <li>vous mentionnez la source des données ;</li>
              <li>vous partagez à l’identique les bases de données dérivées ;</li>
              <li>vous gardez ouvertes ces données.</li>
            </ul>
            <p>Pour plus de renseignements, consultez <a href='http://www.vvlibri.org/fr/licence/odbl/10/fr/legalcode' target='_blank' rel='noopener noreferrer'>la traduction française intégrale de la licence</a> ou le <a href='http://vvlibri.org/fr/licence/odbl/10/fr' target='_blank' rel='noopener noreferrer'>résumé en français</a> disponibles sur le site Veni Vidi Libri, ou bien le texte de référence en anglais sur <a href='http://opendatacommons.org/licenses/odbl/summary/' target='_blank' rel='noopener noreferrer'>Open Data Commons</a>.</p>
          </div>
          <div>
            <h4>Données</h4>
            <p>Les données proposées sous cette licence sont similaires à celles proposées sous licence gratuite de repartage. Néanmoins :</p>
            <ul>
              <li>le libellé à la norme AFNOR et le libellé d’acheminement ne sont pas disponibles ;</li>
              <li>les données subissent <a href='https://github.com/etalab/ban-data/blob/master/scripts/clean.sql'>des traitements qualité supplémentaires.</a></li>
            </ul>
            <p>Données en téléchargement pour une commune, un département, ou la France entière, et disponibles aux formats CSV, Shapefile et JSON.</p>
            <ButtonLink href='http://bano.openstreetmap.fr/BAN_odbl'>
            Accéder aux données
            </ButtonLink>
          </div>
        </div>
      </div>
    </Container>

    <Section title='En partenariat avec' subtitle=''>
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
      `}</style>
  </Page>
)
