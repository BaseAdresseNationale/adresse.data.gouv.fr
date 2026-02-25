'use client'

import AutocompleteInput from '@/components/Autocomplete/AutocompleteInput'
import { DeploiementBALSearchResult, useStatsDeploiement } from '@/hooks/useStatsDeploiement'
import { getEpcis } from '@/lib/api-geo'
import { BANStats } from '@/types/api-ban.types'
import { Departement } from '@/types/api-geo.types'
import { useCallback, useEffect, useState } from 'react'
import Map, { Layer, NavigationControl, Source } from 'react-map-gl/maplibre'
import TabDeploiementBAL from './TabDeploiementBAL'
import { StyledDeploiementBALDashboard } from './DeploiementBALDashboard.styles'
import { Tabs } from '@codegouvfr/react-dsfr/Tabs'
import TabMesAdresses from './TabMesAdresses'
import DeploiementMap, { getStyle } from './DeploiementMap'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { mapToSearchResult } from '@/lib/deploiement-stats'
import { FullScreenControl } from '../Map/FullScreenControl'
import { useSuiviBan } from './useSuiviBan'
import { SuiviBanMapLayers } from './SuiviBanMapLayers'
import { SuiviBanOverlay } from './SuiviBanOverlay'

interface DeploiementBALMapProps {
  initialStats: BANStats
  initialFilter: DeploiementBALSearchResult | null
  departements: (Departement & { centre: { type: string, coordinates: number[] } })[]
}

export default function DeploiementBALMap({ initialStats, initialFilter, departements }: DeploiementBALMapProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { stats, formatedStats, filter, setFilter, filteredCodesCommmune, geometry } = useStatsDeploiement({ initialStats, initialFilter })
  const [selectedTab, setSelectedTab] = useState<'source' | 'bal' | 'suivi-ban'>('source')
  const [origin, setOrigin] = useState('')

  const suivi = useSuiviBan({ selectedTab })

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  // Centrer la France quand on arrive sur l’onglet Déploiement idban (panel 370px à gauche)
  const SUIVI_BAN_PANEL_WIDTH = 370
  useEffect(() => {
    const map = suivi.mapRef.current?.getMap()
    if (!map) return
    if (selectedTab === 'suivi-ban') {
      map.setPadding({ left: SUIVI_BAN_PANEL_WIDTH, top: 0, right: 0, bottom: 0 })
      map.flyTo({
        center: [2.35, 47.95],
        zoom: 4.8,
        duration: 800,
      })
    } else {
      map.setPadding({ left: 0, top: 0, right: 0, bottom: 0 })
    }
  }, [selectedTab])

  const handleSearch = useCallback(async (input: string) => {
    const filteredEpcis = await getEpcis({ q: input, limit: 10, fields: ['centre', 'contour'] })
    const filteredDepartements = departements.filter(({ nom }) => nom.toLowerCase().includes(input.toLowerCase()))

    return [...mapToSearchResult(filteredEpcis, 'EPCI'), ...mapToSearchResult(filteredDepartements, 'Département')]
  }, [departements])

  const handleFilter = useCallback((filter: DeploiementBALSearchResult | null) => {
    // Update URL
    const current = new URLSearchParams(Array.from(searchParams?.entries() || []))
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
            label="Rechercher une collectivité ou un département :"
            value={filter}
            fetchResults={handleSearch}
            onChange={value => handleFilter(value as DeploiementBALSearchResult | null)}
            placeholder="CC du Val d'Amboise ou Indre-et-Loire"
          />
        </div>
        <div className="stats-wrapper">
          <Tabs
            selectedTabId={selectedTab}
            tabs={[
              { tabId: 'source', label: 'Déploiement BAL' },
              { tabId: 'bal', label: 'Suivi Mes-Adresses' },
              { tabId: 'suivi-ban', label: 'Déploiement idban' },
            ]}
            onTabChange={setSelectedTab as (tabId: string) => void}
          >
            <div
              ref={suivi.mapContainerRef}
              className="bal-cover-map-container"
              style={{ position: 'relative', height: selectedTab === 'suivi-ban' ? 650 : undefined }}
            >
              <Map
                ref={suivi.mapRef}
                initialViewState={{
                  longitude: 2,
                  latitude: 47,
                  zoom: 5,
                }}
                mapStyle="/map-styles/osm-vector.json"
                onClick={suivi.handleMapClick}
                interactiveLayerIds={selectedTab === 'suivi-ban' ? suivi.interactiveLayerIds : []}
                cursor={selectedTab === 'suivi-ban' ? 'pointer' : 'auto'}
              >
                <NavigationControl showZoom showCompass position="top-right" />
                <FullScreenControl position="top-right" container={suivi.mapContainerRef.current} />

                <Source promoteId="code" id="data" type="vector" tiles={[`${origin}/api/deploiement-stats/{z}/{x}/{y}.pbf`]}>
                  <Layer
                    id="bal-polygon-fill"
                    type="fill"
                    source="data"
                    source-layer="communes"
                    paint={{
                      'fill-color': getStyle(suivi.balPaintLayer, filteredCodesCommmune),
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
                {selectedTab !== 'suivi-ban' && (
                  <DeploiementMap
                    center={geometry.center}
                    zoom={geometry.zoom}
                    filteredCodesCommmune={filteredCodesCommmune}
                    selectedPaintLayer={suivi.balPaintLayer}
                  />
                )}

                {selectedTab === 'suivi-ban' && <SuiviBanMapLayers suivi={suivi} />}
              </Map>

              {selectedTab === 'suivi-ban' && <SuiviBanOverlay suivi={suivi} filter={filter} />}
            </div>

            {selectedTab === 'source' && <TabDeploiementBAL stats={stats} formatedStats={formatedStats} filter={filter} filteredCodesCommmune={filteredCodesCommmune} />}
            {selectedTab === 'bal' && <TabMesAdresses filteredCodesCommmune={filteredCodesCommmune} />}
          </Tabs>
        </div>
      </div>
    </StyledDeploiementBALDashboard>
  )
}
