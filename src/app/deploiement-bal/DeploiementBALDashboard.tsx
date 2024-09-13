'use client'

import AutocompleteInput from '@/components/AutocompleteInput'
import { useStatsDeploiement } from '@/hooks/useStatsDeploiement'
import { getEpcis } from '@/lib/api-geo'
import { BANStats } from '@/types/api-ban.types'
import { Departement } from '@/types/api-geo.types'
import { useCallback, useState } from 'react'
import Map, { Layer, Source } from 'react-map-gl/maplibre'
import TabDeploiementBAL from './TabDeploiementBAL'
import { StyledDeploiementBALDashboard } from './DeploiementBALDashboard.styles'
import { Tabs } from '@codegouvfr/react-dsfr/Tabs'
import TabMesAdresses from './TabMesAdresses'
import DeploiementMap, { getStyle } from './DeploiementMap'

export type DeploiementBALSearchResultEPCI = {
  type: 'EPCI'
  code: string
  nom: string
  center: { type: string, coordinates: number[] }
  contour: { type: string, coordinates: number[][][] }
}

export type DeploiementBALSearchResultDepartement = {
  type: 'Département'
  code: string
  nom: string
  center: { type: string, coordinates: number[] }
}

export type DeploiementBALSearchResult = DeploiementBALSearchResultEPCI | DeploiementBALSearchResultDepartement

const mapToSearchResult = (values: any[], type: 'EPCI' | 'Département'): DeploiementBALSearchResult[] => values.map(({ code, nom, centre, contour }) => ({ code, type, nom, center: centre, contour }))

interface DeploiementBALMapProps {
  initialStats: BANStats
  departements: (Departement & { centre: { type: string, coordinates: number[] } })[]
}

export default function DeploiementBALMap({ initialStats, departements }: DeploiementBALMapProps) {
  const { stats, formatedStats, filter, setFilter, filteredCodesCommmune, geometry } = useStatsDeploiement({ initialStats })
  const [selectedTab, setSelectedTab] = useState<'source' | 'bal'>('source')

  const handleSearch = useCallback(async (input: string) => {
    const filteredEpcis = await getEpcis({ q: input, limit: 10, fields: ['centre', 'contour'] })
    const filteredDepartements = departements.filter(({ nom }) => nom.toLowerCase().includes(input.toLowerCase()))

    return [...mapToSearchResult(filteredEpcis, 'EPCI'), ...mapToSearchResult(filteredDepartements, 'Département')]
  }, [departements])

  return (
    <StyledDeploiementBALDashboard>
      <div className="map-stats-container" id="map-stat">
        <div className="stats-wrapper">
          <AutocompleteInput
            value={filter}
            fetchResults={handleSearch}
            onChange={newValue => setFilter(newValue as DeploiementBALSearchResult)}
            placeholder="CC du Val d'Amboise ou Indre-et-Loire"
          />
          <Tabs
            selectedTabId={selectedTab}
            tabs={[
              { tabId: 'source', label: 'Déploiement BAL' },
              { tabId: 'bal', label: 'Suivi Mes-Adresses' },
            ]}
            onTabChange={setSelectedTab as (tabId: string) => void}
          >
            {selectedTab === 'source' && <TabDeploiementBAL stats={stats} formatedStats={formatedStats} filter={filter} filteredCodesCommmune={filteredCodesCommmune} />}
            {selectedTab === 'bal' && <TabMesAdresses filteredCodesCommmune={filteredCodesCommmune} />}
          </Tabs>
        </div>
        <div className="bal-cover-map-container">
          <Map
            initialViewState={{
              longitude: 2,
              latitude: 47,
              zoom: 5,
            }}
            mapStyle="/map-styles/osm-bright.json"
          >
            <Source id="data" type="geojson" data={`${process.env.NEXT_PUBLIC_ADRESSE_URL}/api/deploiement-map`}>
              <Layer
                id="bal-polygon-fill"
                type="fill"
                source="data"
                source-layer="communes"
                paint={{
                  'fill-color': getStyle(selectedTab, filteredCodesCommmune),
                  'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    0.8,
                    0.6,
                  ],
                }}
                filter={['==', '$type', 'Polygon']}
              />
            </Source>
            <DeploiementMap
              center={geometry.center}
              zoom={geometry.zoom}
              filteredCodesCommmune={filteredCodesCommmune}
              selectedPaintLayer={selectedTab}
              setSelectedPaintLayer={setSelectedTab}
            />
          </Map>
        </div>
      </div>
    </StyledDeploiementBALDashboard>
  )
}
