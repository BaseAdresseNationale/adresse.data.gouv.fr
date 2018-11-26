import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import {Line} from 'react-chartjs-2'
import FaCheckSquareO from 'react-icons/lib/fa/check-square-o'
import FaFileTextO from 'react-icons/lib/fa/file-text-o'

import Section from '../section'
import ButtonLink from '../button-link'
import Mapbox from '../mapbox'

import BaseAdresseLocale from './bases-adresse-locales/base-adresse-locale'
import BalMap from './bal-map'
import Pie from './pie'
import Counter from './counter'

class BasesLocales extends React.PureComponent {
  render() {
    const {datasets, stats} = this.props
    const conformBal = parseFloat(((100 / stats.balNb) * stats.conformNb).toPrecision(3))

    return (
      <div>
        <Section background='white'>
          <Mapbox>
            {(map, marker, popUp) => (
              <BalMap
                map={map}
                popUp={popUp}
                data={stats.bal}
                regions={stats.regions}
              />
            )}
          </Mapbox>

          <div className='stats'>
            <h1>Bases locales déjà publiées</h1>

            <div className='pies'>
              <div className='pie'>
                <Counter
                  value={stats.balNb}
                  title='Bases locales déjà publiées'
                />

                <Counter
                  value={conformBal}
                  unit='%'
                  color={conformBal < 20 ? 'error' : conformBal < 50 ? 'warning' : 'success'}
                  title='Bases locales conformes'
                />
              </div>

              <div className='pie'>
                <Pie data={{
                  'Licence Ouverte': stats.loNb,
                  ODbL: stats.odblNb
                }} />
              </div>

              <div className='pie'>
                <Counter
                  value={2267620}
                  title='Adresses gérées par les collectivités'
                />
              </div>
            </div>

            <Line data={stats.balCreationProgress} height={100} />
          </div>
        </Section>

        <Section background='white'>
          <div className='intro'>
            <p>La <b>création des voies et des adresses</b> en France est du ressort des <b>communes</b>, via le conseil municipal.<br />{}
            Cette compétence est <b>régulièrement déléguée à un EPCI</b>.</p>
            <p>Une <b>base Adresse locale</b> est donc l’expression de cette compétence, et regroupe tout ou partie des adresses d’une collectivité.<br />{}
            Elle est <b>publiée sous sa responsabilité</b>.</p>
            <p>Ces bases de données ont vocation à <b>alimenter les bases nationales</b>, et en particulier la Base Adresse Nationale.</p>
          </div>
        </Section>

        <Section background='white'>
          <h4>Qu’est-ce que le format BAL ?</h4>
          <div>
            <p>L’<a href='http://www.aitf.fr/'>Association des Ingénieurs Territoriaux de France</a> (AITF) a créé en avril 2015 un groupe de travail portant sur la Base Adresse Nationale.</p>
            <p>Les <a href='https://cms.geobretagne.fr/content/travaux-gt-ban-aitf'>travaux de ce groupe</a> ont abouti à la <a href='https://cms.geobretagne.fr/sites/default/files/documents/aitf-sig-topo-adresse-fichier-echange-simplifie-v_1.1_0.pdf'>spécification d’un format d’échange</a>, aujourd’hui en version 1.1.</p>
            <p>Le format <b>BAL 1.1</b> est aujourd’hui le format d’échange à privilégier pour les données Adresse produites localement.</p>
          </div>
          <div className='action'>
            <Link href='/bases-locales/validateur'>
              <ButtonLink>Valider vos données au format BAL <FaCheckSquareO /></ButtonLink>
            </Link>
          </div>
        </Section>

        <Section background='grey'>
          <h4>Créer ou modifier une Base Adresse Locale (beta)</h4>
          <div>
            <p>Cet outil permet de générer une nouvelle Base Adresse Locale à partir de la BAN, ou d’éditer une Base Adresse Locale existante.</p>
            <p>Il permet de gérer très simplement les <strong>voies</strong>, les <strong>numéros</strong> et les <strong>positions</strong> d’une commune ou d’une intercommunalité, mais aussi de gérer des <strong>toponymes</strong>.</p>
            <p>Les données résultantes peuvent (et devraient) être republiées par la collectivité sous <a href='https://www.etalab.gouv.fr/licence-version-2-0-de-la-licence-ouverte-suite-a-la-consultation-et-presentation-du-decret'>Licence Ouverte</a>.</p>
          </div>
          <div className='action'>
            <Link href='/bases-locales/editeur'>
              <ButtonLink>Éditer une Base Adresse Locale <FaFileTextO /></ButtonLink>
            </Link>
          </div>
        </Section>

        <Section title='Quelques bases locales déjà publiées' background='white'>
          {datasets.slice(0, 3).map(dataset => (
            <BaseAdresseLocale key={dataset.id} {...dataset} />
          ))}
          <div className='centered'>
            <Link href='/bases-locales/jeux-de-donnees'>
              <ButtonLink>
                Voir toutes les bases locales
              </ButtonLink>
            </Link>
          </div>
        </Section>

        <style jsx>{`
          .intro {
            text-align: left;
          }

          .row {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: stretch;
            width: 100%;
          }

          .row .column {
            margin: 0 2em;
            max-width: 50em;
          }

          .row .column + .column {
            margin-left: 2em;
          }

          @media (max-width: 749px) {
            .row {
              flex-direction: column;
            }

            .row .column:not(:last-child) {
              margin-bottom: 2em;
            }

            .row p + p {
              text-align: center;
              margin-top: 1em;
            }
          }

          .action {
            display: flex;
            margin-top: 3em;
          }

          .centered {
            display: flex;
            justify-content: center;
          }

          .stats {
            text-align: center;
          }

          .pies {
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex-flow: wrap;
            margin: 2em 0;
          }

          .pie {
            margin: 0 0.5em;
            min-width: 200px;
          }

          a {
            text-align: center;
            text-decoration: underline;
          }
        `}</style>
      </div>
    )
  }
}

BasesLocales.propTypes = {
  datasets: PropTypes.array.isRequired,
  stats: PropTypes.shape({
    bal: PropTypes.object.isRequired,
    regions: PropTypes.object.isRequired,
    balNb: PropTypes.number.isRequired,
    odblNb: PropTypes.number.isRequired,
    loNb: PropTypes.number.isRequired,
    conformNb: PropTypes.number.isRequired,
    balCreationProgress: PropTypes.object.isRequired
  }).isRequired
}

export default BasesLocales
