import PropTypes from 'prop-types'

import Page from '@/layouts/main'
import Head from '@/components/head'
import theme from '@/styles/theme'
import {Database} from 'react-feather'

import {getStats} from '@/lib/api-ban'
import {numFormater} from '@/lib/format-numbers'

import MapLibre from '@/components/maplibre'
import DoughnutCounter from '@/components/doughnut-counter'

import BalCoverMap from '@/components/bases-locales/bal-cover-map'

function toCounterData(percent, total) {
  return {
    labels: [],
    datasets: [
      {
        data: [percent, total],
        backgroundColor: [
          'rgba(0, 83, 179, 1)',
          'rgba(0, 0, 0, 0)'
        ],
        borderColor: [
          'rgba(1, 1, 1, 0)',
          'rgba(1, 1, 1, 0.3)'
        ],
        borderWidth: 1,
      },
    ]
  }
}

const options = {
  height: 200,
  width: 200,
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false
    }
  }
}

function EtatDeploiement({stats}) {
  // Calcul population couverte
  const populationCouvertePercent = Math.round((stats.bal.populationCouverte * 100) / stats.france.population)
  const allPopulationCouverte = 100 - Math.round((stats.bal.populationCouverte * 100) / stats.france.population)
  const dataPopulationCouverte = toCounterData(populationCouvertePercent, allPopulationCouverte)

  // Calcul communes couvertes
  const communesCouvertesPercent = Math.round((stats.bal.nbCommunesCouvertes * 100) / stats.france.nbCommunes)
  const allCommunesCouvertesPercent = 100 - Math.round((stats.bal.nbCommunesCouvertes * 100) / stats.france.nbCommunes)
  const dataCommunesCouvertes = toCounterData(communesCouvertesPercent, allCommunesCouvertesPercent)

  // Calcul adresses gerees dans la BAL
  const adressesGereesBALPercent = Math.round((stats.bal.nbAdresses * 100) / stats.ban.nbAdresses)
  const allAdressesGereesBALPercent = 100 - Math.round((stats.bal.nbAdresses * 100) / stats.ban.nbAdresses)
  const dataAdressesGereesBAL = toCounterData(adressesGereesBALPercent, allAdressesGereesBALPercent)

  // Calcul adresses certifiees
  const adressesCertifieesPercent = Math.round((stats.bal.nbAdressesCertifiees * 100) / stats.ban.nbAdresses)
  const allAdressesCertifieesPercent = 100 - Math.round((stats.bal.nbAdressesCertifiees * 100) / stats.ban.nbAdresses)
  const dataAdressesCertifiees = toCounterData(adressesCertifieesPercent, allAdressesCertifieesPercent)

  return (
    <Page>
      <div className='container-map'>
        <Head title='État du déploiement des Bases Adresses Locales' icon={<Database size={56} alt aria-hidden='true' />} />
        <div className='map-stats-container' id='map-stat'>
          <div className='stats'>
            <DoughnutCounter
              title='Adresses issues des BAL'
              valueUp={numFormater(stats.bal.nbAdresses)}
              valueDown={`${adressesGereesBALPercent}% des ${numFormater(stats.ban.nbAdresses)} d’adresses présentes dans la BAN`}
              data={dataAdressesGereesBAL}
              options={options}
            />
            <DoughnutCounter
              title='Communes couvertes'
              valueUp={numFormater(stats.bal.nbCommunesCouvertes)}
              valueDown={`${communesCouvertesPercent}% des ${numFormater(stats.france.nbCommunes)} communes françaises`}
              data={dataCommunesCouvertes}
              options={options}
            />
            <DoughnutCounter
              title='Population couverte'
              valueUp={numFormater(stats.bal.populationCouverte)}
              valueDown={`${Math.round((stats.bal.populationCouverte * 100) / stats.france.population)}% des ${numFormater(stats.france.population)} d’habitants`}
              data={dataPopulationCouverte}
              options={options}
            />
            <DoughnutCounter
              title='Adresses certifiées'
              valueUp={numFormater(stats.bal.nbAdressesCertifiees)}
              valueDown={`${adressesCertifieesPercent}% des ${numFormater(stats.ban.nbAdresses)} d’adresses présentes dans la BAN`}
              data={dataAdressesCertifiees}
              options={options}
            />
          </div>
          <div className='bal-cover-map-container'>
            <MapLibre>
              {({map, popup, setSources, setLayers}) => (
                <BalCoverMap
                  map={map}
                  popup={popup}
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
            height: fit-content;
            flex: 1;
            display: grid;
            grid-template-columns: repeat( auto-fit, minmax(250px, 1fr) );
            gap: 1em;
            padding: 1em;
          }

          .bal-cover-map-container {
            height: 100%;
            min-height: 400px;
            flex: 1;
          }

          .bal-cover-map-container children {
            width: 100%;
          }

          @media (max-width: ${theme.breakPoints.desktop}) {
            .map-stats-container {
              flex-direction: column;
            }
          }
          `}</style>
      </div>
    </Page>
  )
}

EtatDeploiement.getInitialProps = async () => {
  return {
    stats: await getStats(),
  }
}

EtatDeploiement.propTypes = {
  stats: PropTypes.shape({
    france: PropTypes.object.isRequired,
    bal: PropTypes.object.isRequired,
    ban: PropTypes.object.isRequired
  }).isRequired
}

export default EtatDeploiement
