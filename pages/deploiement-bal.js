import React from 'react'
import PropTypes from 'prop-types'

import Page from '@/layouts/main'
import Head from '@/components/head'
import theme from '@/styles/theme'
import {Database} from 'react-feather'

import {getDatasets, getStats} from '@/lib/bal/api'

import MapLibre from '@/components/maplibre'

import BalCoverMap from '@/components/bases-locales/bal-cover-map'

const EtatDeploiement = React.memo(({datasets, stats}) => {
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

  return (
    <Page>
      <div className='container-map'>
        <Head title='État du déploiement des Bases Adresses Locales' icon={<Database size={56} />} />
        <div className='map-stats-container' id='map-stat'>
          <div className='stats'>
            <div className='stat'>Population couverte : <div className='value'>11%</div></div>
            <div className='stat'>Communes couvertes : <div className='value'>11%</div></div>
            <div className='stat'>Adresses gérées dans la BAL : <div className='value'>16%</div></div>
            <div className='stat'>Adresses certifiées : <div className='value'>24%</div></div>
          </div>
          <div className='bal-cover-map-container'>
            <MapLibre>
              {({map, popup, setSources, setLayers}) => (
                <BalCoverMap
                  map={map}
                  popup={popup}
                  data={mapData}
                  setSources={setSources}
                  setLayers={setLayers}
                />
              )}
            </MapLibre>
          </div>
        </div>

        <style jsx>{`
          .container-map {
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;
          }

          .map-stats-container {
            display: flex;
            justify-content: space-around;
            height: 100%;
            text-align: center;
          }

          .stats {
            flex: 1;
            display: grid;
            grid-template-columns: repeat( auto-fit, minmax(300px, 1fr) );
            font-size: 1.2em;
            font-weight: bold;
          }

          .stat {
            align-self: stretch;
            display: grid;
            align-content: center;
            padding: .5em;
          }

          .value {
            font-size: 1.5em;
          }

          .bal-cover-map-container {
            height: 100%;
            min-height: 400px;
            flex: 3;
          }

          .bal-cover-map-container children {
            width: 100%;
          }

          .side-btn {
            position: absolute;
            z-index: 3;
            background-color: #fff;
          }

          @media (max-width: ${theme.breakPoints.desktop}) {
            .map-stats-container {
              flex-direction: column;
            }

            .stat {
              padding: 1em;
            }
          }
          `}</style>
      </div>
    </Page>
  )
})

EtatDeploiement.getInitialProps = async () => {
  return {
    datasets: await getDatasets(),
    stats: await getStats(),
  }
}

EtatDeploiement.propTypes = {
  datasets: PropTypes.array.isRequired,
  stats: PropTypes.shape({
    count: PropTypes.number.isRequired,
    rowsCount: PropTypes.number.isRequired,
    communesCount: PropTypes.number.isRequired
  }).isRequired
}

export default EtatDeploiement
