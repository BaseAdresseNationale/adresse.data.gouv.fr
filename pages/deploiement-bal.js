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

import {useStatsDeploiement} from '@/hooks/stats-deploiement'

import {MapLegacy as MapLibre} from '@/components/maplibre'
import BalCoverMap from '@/components/bases-locales/deploiement-bal/bal-cover-map'
import PanelSource from '@/components/bases-locales/deploiement-bal/panel-source'
import PanelBal from '@/components/bases-locales/deploiement-bal/panel-bal'
import SearchInput from '@/components/search-input-legacy'
import SearchSelected from '@/components/search-input-legacy/search-selected'
import StatsSearchItem from '@/components/search-input-legacy/stats-search-item'

const ADRESSE_URL = process.env.NEXT_PUBLIC_ADRESSE_URL || 'http://localhost:3000'

const mapToSearchResult = (values, type) => values.map(({code, nom, centre, contour}) => ({value: code, type, nom, center: centre, contour}))
function EtatDeploiement({initialStats, departements}) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState([])
  const {stats, formatedStats, filter, setFilter, filteredCodesCommmune, geometry} = useStatsDeploiement({initialStats})
  const [selectedPanel, setSelectedPanel] = useState('source')

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

  const handleSelect = async item => {
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
            {selectedPanel === 'source' ? (
              <PanelSource stats={stats} formatedStats={formatedStats} />
            ) : (
              <PanelBal filteredCodesCommmune={filteredCodesCommmune} />
            )}
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
                    selectedPaintLayer={selectedPanel}
                    setSelectedPaintLayer={setSelectedPanel}
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
            height: calc(100vh - 270px);
            text-align: center;
          }

          .stats-wrapper {
            display: flex;
            flex-direction: column;
            width: 30%;
            padding: 1em;
            overflow: scroll;
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
            width: 70%;
          }

          .bal-cover-map-container children {
            width: 100%;
          }

          @media (max-width: ${theme.breakPoints.desktop}) {
            .map-stats-container {
              flex-direction: column;
            }
            .bal-cover-map-container {
              width: 100%;
              height: 100%;
            }
            .stats-wrapper {
              width: 100%;
              height: 100%;
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
    departements: departementsWithCenter,
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
