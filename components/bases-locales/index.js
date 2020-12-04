import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import {shuffle} from 'lodash'
import {CheckSquare, HelpCircle} from 'react-feather'

import Mapbox from '../mapbox'
import Section from '../section'
import ButtonLink from '../button-link'
import Counter from '../ui/metrics/counter'

import BaseAdresseLocale from './bases-adresse-locales/base-adresse-locale'
import BalCoverMap from './bal-cover-map'
import Notification from '../notification'

const BasesLocales = React.memo(({datasets, stats}) => {
  const [balSamples, setBalSamples] = useState([])
  const mapData = {
    type: 'FeatureCollection',
    features: datasets.map(dataset => ({
      type: 'Feature',
      properties: {
        id: dataset.id,
        nom: dataset.title,
        license: dataset.license,
        organization: dataset.organization ? dataset.organization.name : null
      },
      geometry: dataset.contour
    }))
  }

  useEffect(() => {
    if (datasets) {
      const shuffleBalSamples = () => shuffle(datasets.filter(d => d.model === 'bal-aitf')).slice(0, 3)
      setBalSamples(shuffleBalSamples)
    }
  }, [datasets])

  return (
    <div>
      <Section>
        <div style={{textAlign: 'center'}}>
          <p>
            La <b>création des voies et des adresses</b> en France est du ressort des <b>communes</b>, via le conseil municipal.<br />{}
            Les communes peuvent néanmoins être accompagnées par une structure de mutualisation (EPCI, département, …).
          </p>
          <p>
            Une <b>Base Adresse Locale</b> regroupe toutes les adresses d’une ou plusieurs communes et est <b>publiée sous leur responsabilité</b>.
          </p>
          <p><b>Elles alimentent la Base Adresse Nationale</b>.</p>
        </div>

        <Notification style={{margin: '2em 0 -1em 0'}}>
          <div>
            <HelpCircle style={{verticalAlign: 'bottom', marginRight: '4px'}} />
            Vous êtes une commune et souhaitez mettre en place une Base Adresse Locale à l’aide d’outils existants ? <Link href='/gerer-mes-adresses'><a>C’est par ici</a></Link>.
          </div>
        </Notification>
      </Section>

      <Section background='color'>
        <h4>Qu’est-ce que le format BAL ?</h4>
        <div>
          <p>L’<a href='http://www.aitf.fr/'>Association des Ingénieurs Territoriaux de France</a> (AITF) a créé en avril 2015 un groupe de travail portant sur la Base Adresse Nationale.</p>
          <p>Les <a href='https://cms.geobretagne.fr/content/travaux-gt-ban-aitf'>travaux de ce groupe</a> ont abouti à la <a href='https://cms.geobretagne.fr/sites/default/files/documents/aitf-sig-topo-adresse-fichier-echange-simplifie-v_1.1_0.pdf'>spécification d’un format d’échange</a>, aujourd’hui en version 1.1.</p>
          <p>Le format <b>BAL 1.1</b> est aujourd’hui le format d’échange à privilégier pour les données Adresse produites localement.</p>
        </div>
        <div className='action'>
          <ButtonLink
            size='large'
            href='/bases-locales/validateur'
          >
            Valider vos données au format BAL <CheckSquare style={{verticalAlign: 'middle', marginLeft: '3px'}} />
          </ButtonLink>
        </div>
      </Section>

      <Section title='Quelques Bases Adresses Locales déjà publiées' background='white'>
        <div className='bal-grid'>
          {balSamples.map(dataset => (
            <BaseAdresseLocale key={dataset.id} dataset={dataset} />
          ))}
        </div>
        <div className='centered'>
          <ButtonLink
            size='large'
            href='/bases-locales/jeux-de-donnees'
          >
            Voir toutes les Bases Adresses Locales
          </ButtonLink>
        </div>
      </Section>

      <Section title='État du déploiement des Bases Adresses Locales'>
        <div className='map-stats-container'>
          <div className='stats'>
            <Counter
              value={stats.count}
              title='Jeux de données publiés'
            />
            <Counter
              title='Communes représentées'
              value={stats.communesCount}
            />
            <Counter
              title='Adresses gérées par les collectivités'
              value={stats.numerosCount}
            />
          </div>
          <div className='bal-cover-map-container'>
            <Mapbox>
              {({map, popup, setSources, setLayers}) => (
                <BalCoverMap
                  map={map}
                  popup={popup}
                  data={mapData}
                  setSources={setSources}
                  setLayers={setLayers}
                />
              )}
            </Mapbox>
          </div>
        </div>
      </Section>

      <style jsx>{`
        .bal-grid {
          display: grid;
          grid-row-gap: 2em;
          margin: 4em 0;
        }

        .action {
          display: flex;
          flex-flow: row wrap;
          justify-content: space-around;
          margin-top: 3em;
        }

        .button-link {
          margin: 0.5em 0;
        }

        .centered {
          margin: 40px auto;
          display: flex;
          justify-content: center;
        }

        .map-stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          margin: 4em 0;
        }

        .stats {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          margin-right: 1em;
        }

        .bal-cover-map-container {
          height: 500px;
        }

        a {
          text-align: center;
        }

        @media (max-width: 1016px) {
          .bal-cover-map-container {
            margin-top: 2em;
          }
        }
        `}</style>
    </div>
  )
})

BasesLocales.propTypes = {
  datasets: PropTypes.array.isRequired,
  stats: PropTypes.shape({
    isValid: PropTypes.number.isRequired,
    model: PropTypes.object.isRequired,
    count: PropTypes.number.isRequired,
    numerosCount: PropTypes.number.isRequired,
    communesCount: PropTypes.number.isRequired,
    license: PropTypes.object.isRequired
  }).isRequired
}

export default BasesLocales
