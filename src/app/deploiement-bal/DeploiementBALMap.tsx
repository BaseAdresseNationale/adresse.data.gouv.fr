'use client'

import AutocompleteInput from '@/components/AutocompleteInput'
import Section from '@/components/Section'
import { useStatsDeploiement } from '@/hooks/useStatsDeploiement'
import { getEpcis } from '@/lib/api-geo'
import { customFetch } from '@/lib/fetch'
import { BANStats } from '@/types/api-ban.types'
import { Departement } from '@/types/api-geo.types'
import Button from '@codegouvfr/react-dsfr/Button'
import { useCallback, useState } from 'react'
import Map from 'react-map-gl'

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
  const [selectedPanel, setSelectedPanel] = useState('source')

  const handleSearch = useCallback(async (input: string) => {
    const filteredEpcis = await getEpcis({ q: input, limit: 10, fields: ['centre', 'contour'] })
    const filteredDepartements = departements.filter(({ nom }) => nom.toLowerCase().includes(input.toLowerCase()))

    return [...mapToSearchResult(filteredEpcis, 'EPCI'), ...mapToSearchResult(filteredDepartements, 'Département')]
  }, [departements])

  const handleDownloadCSV = async () => {
    const url = new URL(`/api/deploiement/couverture-stats`)
    url.searchParams.append('codesCommune', filteredCodesCommmune.toString())

    const csvHeaders = ['code', 'nom', 'nbNumeros', 'certificationPercentage', 'hasBAL', 'nomClient']
    const { features } = await customFetch(url)
    const csvString = [csvHeaders.join(';'), ...features.map(({ properties }) => csvHeaders.map(property => properties[property]).join(';'))].join('\n')

    const link = document.createElement('a')
    link.href = 'data:text/csv,' + encodeURIComponent(csvString)
    link.download = 'deploiement-bal.csv'
    link.click()
  }

  return (
    <Section pageTitle="État du déploiement des Bases Adresses Locales">
      <div className="container-map">
        <div className="map-stats-container" id="map-stat">
          <div className="stats-wrapper">
            <div>
              <AutocompleteInput value={filter} fetchResults={handleSearch} onChange={newValue => setFilter(newValue as DeploiementBALSearchResult)} label="Rechercher un EPCI ou un département" placeholder="'CC du Val d'Amboise' ou 'Indre-et-Loire'" />
              <Button type="button" onClick={handleDownloadCSV} iconId="fr-icon-download-fill">
                Télécharger les données au format CSV
              </Button>
            </div>
            {/* {selectedPanel === 'source'
              ? (
                  <PanelSource stats={stats} formatedStats={formatedStats} />
                )
              : (
                  <PanelBal filteredCodesCommmune={filteredCodesCommmune} />
                )} */}
          </div>
          <div className="bal-cover-map-container">
            <Map>
              {/* {({ map, popup, setSources, setLayers }) => {
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
              }} */}
            </Map>
          </div>
        </div>
      </div>
    </Section>
  )
}
