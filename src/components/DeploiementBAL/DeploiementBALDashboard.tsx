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
import { DeploiementBALSearchResult, mapToSearchResult } from '@/app/deploiement-bal/page'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

interface DeploiementBALMapProps {
  initialStats: BANStats
  initialFilter: DeploiementBALSearchResult | null
  departements: (Departement & { centre: { type: string, coordinates: [number, number] } })[]
}

export default function DeploiementBALMap({ initialStats, initialFilter, departements }: DeploiementBALMapProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { stats, formatedStats, filter, setFilter, filteredCodesCommmune, geometry } = useStatsDeploiement({ initialStats, initialFilter })
  const [selectedTab, setSelectedTab] = useState<'source' | 'bal'>('source')

  const handleSearch = useCallback(async (input: string) => {
    const filteredEpcis = await getEpcis({ q: input, limit: 10, fields: ['centre', 'contour'] })
    const filteredDepartements = departements.filter(({ nom }) => nom.toLowerCase().includes(input.toLowerCase()))

    return [...mapToSearchResult(filteredEpcis, 'EPCI'), ...mapToSearchResult(filteredDepartements, 'Département')]
  }, [departements])

  const handleFilter = useCallback((filter: DeploiementBALSearchResult | null) => {
    // Update URL
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    current.delete('epci')
    current.delete('departement')
    if (filter) {
      if (filter.type === 'EPCI') {
        current.set('epci', filter.code)
      }
      else if (filter.type === 'Département') {
        current.set('departement', filter.code)
      }
    }
    const search = current.toString()
    const query = search ? `?${search}` : ''
    router.replace(`${pathname}${query}`)
    setFilter(filter)
  }, [setFilter, pathname, searchParams, router])

  return (
    <StyledDeploiementBALDashboard>
      <div className="map-stats-container" id="map-stat">
        <div className="input-wrapper">
          <AutocompleteInput
            value={filter}
            fetchResults={handleSearch}
            onChange={value => handleFilter(value as DeploiementBALSearchResult | null)}
            placeholder="CC du Val d'Amboise ou Indre-et-Loire"
          />
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
            <Source promoteId="code" id="data" type="geojson" data={`${process.env.NEXT_PUBLIC_ADRESSE_URL}/api/deploiement-map`}>
              <Layer
                id="bal-polygon-fill"
                type="fill"
                source="data"
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
            />
          </Map>
        </div>
        <div className="stats-wrapper">

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
      </div>
    </StyledDeploiementBALDashboard>
  )
}
