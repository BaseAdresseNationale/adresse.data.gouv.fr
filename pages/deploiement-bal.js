import {useEffect, useState, useCallback} from 'react'
import PropTypes from 'prop-types'

import Page from '@/layouts/main'
import Head from '@/components/head'
import theme from '@/styles/theme'
import {Database, Download} from 'react-feather'
import {debounce} from 'lodash'

import departementCenterMap from '@/data/geo/departement-center.json'

import {_fetch, getStats} from '@/lib/api-ban'
import {getDepartements, getEpcis} from '@/lib/api-geo'
import {numFormater} from '@/lib/format-numbers'

import {useStatsDeploiement} from '@/hooks/stats-deploiement'

import MapLibre from '@/components/maplibre'
import DoughnutCounter from '@/components/doughnut-counter'
import BalCoverMap from '@/components/bases-locales/bal-cover-map'
import SearchInput from '@/components/search-input'
import SearchSelected from '@/components/search-input/search-selected'
import StatsSearchItem from '@/components/search-input/stats-search-item'

const ADRESSE_URL = process.env.NEXT_PUBLIC_ADRESSE_URL || 'http://localhost:3000'

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

const mapToSearchResult = (values, type) => values.map(({code, nom, centre, contour}) => ({value: code, type, nom, center: centre, contour}))

function EtatDeploiement({initialStats, departements}) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState([])
  const {stats, formatedStats, filter, setFilter, filteredCodesCommmune, geometry} = useStatsDeploiement({initialStats})

  const {
    dataPopulationCouverte,
    communesCouvertesPercent,
    dataCommunesCouvertes,
    adressesGereesBALPercent,
    dataAdressesGereesBAL,
    adressesCertifieesPercent,
    dataAdressesCertifiees,
    total
  } = formatedStats

  const handleSearch = useCallback(debounce(async input => {
    setIsLoading(true)
    try {
      const filteredEpcis = await getEpcis({q: input, limit: 10, fields: ['centre', 'contour']})
      const filteredDepartements = departements.filter(({nom}) => nom.toLowerCase().includes(input.toLowerCase()))

      const results = [...mapToSearchResult(filteredEpcis, 'EPCI'), ...mapToSearchResult(filteredDepartements, 'Département')]

      setResults(results)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, 300), [])

  const handleResetSearch = () => {
    setFilter(null)
    setInput('')
  }

  const handleSelect = item => {
    setFilter(item)
    setInput(item.nom)
  }

  useEffect(() => {
    if (input) {
      handleSearch(input)
    } else if (input === '') {
      setResults([])
    }
  }, [input])

  const handleDownloadCSV = async () => {
    const url = new URL(`${ADRESSE_URL}/deploiement/couverture-stats`)
    url.searchParams.append('codesCommune', filteredCodesCommmune)

    const csvHeaders = ['code', 'nom', 'nbNumeros', 'certificationPercentage', 'hasBAL', 'nomClient']
    const {features} = await _fetch(url)
    const csvString = [csvHeaders.join(';'), ...features.map(({properties}) => csvHeaders.map(property => properties[property]).join(';'))].join('\n')

    const link = document.createElement('a')
    link.href = 'data:text/csv,' + encodeURIComponent(csvString)
    link.download = 'deploiement-bal.csv'
    link.click()
  }

  const renderInput = () => (
    <div className='selected-filter-input'>
      <SearchSelected value={input} onReset={handleResetSearch} />
      <button title='Télécharger les données au format CSV' type='button' onClick={handleDownloadCSV}>
        <Download />
      </button>
      <style jsx>{`
        .selected-filter-input {
          display: flex;
        }
        .selected-filter-input button {
          margin-left: 5px;
        }
        .selected-filter-input button:hover {
          background: transparent;
          color: ${theme.colors.darkGrey};
        }
      `}</style>
    </div>
  )

  return (
    <Page>
      <div className='container-map'>
        <Head title='État du déploiement des Bases Adresses Locales' icon={<Database size={56} alt='' aria-hidden='true' />} />
        <div className='map-stats-container' id='map-stat'>
          <div className='stats-wrapper'>
            <SearchInput
              value={input}
              results={results}
              isLoading={isLoading}
              placeholder='Filtrer par EPCI ou par département'
              onSelect={handleSelect}
              onSearch={setInput}
              getItemValue={item => item.nom}
              renderInput={filter ? renderInput : undefined}
              wrapperStyle={{position: 'relative'}}
              renderItem={StatsSearchItem}
            />
            <div className='stats'>
              {!Number.isNaN(adressesGereesBALPercent) && <DoughnutCounter
                title='Adresses issues des BAL'
                valueUp={numFormater(stats.bal.nbAdresses)}
                valueDown={`${adressesGereesBALPercent}% des ${numFormater(stats.ban.nbAdresses)} d’adresses présentes dans la BAN`}
                data={dataAdressesGereesBAL}
                options={options}
              />}
              <DoughnutCounter
                title='Communes couvertes'
                valueUp={numFormater(stats.bal.nbCommunesCouvertes)}
                valueDown={`${communesCouvertesPercent}% des ${numFormater(total.nbCommunes)} communes`}
                data={dataCommunesCouvertes}
                options={options}
              />
              <DoughnutCounter
                title='Population couverte'
                valueUp={numFormater(stats.bal.populationCouverte)}
                valueDown={`${Math.round((stats.bal.populationCouverte * 100) / total.population)}% des ${numFormater(total.population)} d’habitants`}
                data={dataPopulationCouverte}
                options={options}
              />
              {!Number.isNaN(adressesGereesBALPercent) && <DoughnutCounter
                title='Adresses certifiées'
                valueUp={numFormater(stats.bal.nbAdressesCertifiees)}
                valueDown={`${adressesCertifieesPercent}% des ${numFormater(stats.ban.nbAdresses)} d’adresses présentes dans la BAN`}
                data={dataAdressesCertifiees}
                options={options}
              />}
            </div>
          </div>
          <div className='bal-cover-map-container'>
            <MapLibre>
              {({map, popup, setSources, setLayers}) => {
                return (
                  <BalCoverMap
                    map={map}
                    popup={popup}
                    setSources={setSources}
                    setLayers={setLayers}
                    center={geometry.center}
                    zoom={geometry.zoom}
                    filteredCodesCommmune={filteredCodesCommmune}
                  />
                )
              }}
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

          .stats-wrapper {
            display: flex;
            flex-direction: column;
            flex: 1;
            padding: 1em;
          }

          .stats {
            height: fit-content;
            display: grid;
            grid-template-columns: repeat( auto-fit, minmax(250px, 1fr) );
            gap: 1em;
            margin-top: 1em;
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
  const departements = await getDepartements()
  const departementsWithCenter = departements.map(({code, ...rest}) => {
    const {geometry} = departementCenterMap[code]

    return {
      ...rest,
      code,
      centre: geometry
    }
  })

  return {
    initialStats: await getStats(),
    departements: departementsWithCenter
  }
}

EtatDeploiement.propTypes = {
  initialStats: PropTypes.shape({
    france: PropTypes.object.isRequired,
    bal: PropTypes.object.isRequired,
    ban: PropTypes.object.isRequired
  }).isRequired,
  departements: PropTypes.arrayOf(PropTypes.shape({
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
  })).isRequired,
}

export default EtatDeploiement
