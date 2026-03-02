'use client'

import DoughnutCounter from '@/components/ChartJS/DoughnutCounter'
import { DeploiementBALSearchResult } from '@/hooks/useStatsDeploiement'
import { customFetch } from '@/lib/fetch'
import { BANStats } from '@/types/api-ban.types'
import { numFormater } from '@/utils/number'
import Button from '@codegouvfr/react-dsfr/Button'
import { useState } from 'react'
import styled from 'styled-components'
import ListCommunes from './ListCommunes'

const StyledWrapper = styled.div`
  .download-wrapper {
    display: flex;
    align-items: center;
    margin-top: 1em;
    label {
        margin-right: 1em;
    }
    button {
        margin-right: 1em;
    }
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    .download-wrapper {
      flex-direction: column;
      gap: 1em;
    } 
  }
`

interface TabDeploiementBALProps {
  stats: BANStats
  formatedStats: any
  filteredCodesCommmune: string[]
  filter: DeploiementBALSearchResult | null
}

export default function TabDeploiementBAL({ stats, formatedStats, filteredCodesCommmune, filter }: TabDeploiementBALProps) {
  const [isDownloadingData, setIsDownloadingData] = useState(false)

  const handleDownloadCSV = async () => {
    try {
      setIsDownloadingData(true)
      const url = new URL(`${window.location.origin}/api/deploiement-stats`)
      url.searchParams.append('codesCommune', filteredCodesCommmune.toString())

      const csvHeaders = ['code', 'nom', 'nbNumeros', 'certificationPercentage', 'hasBAL', 'nomClient']
      const response = await customFetch(url)
      console.log(response)
      const csvString = [csvHeaders.join(';'), ...response.features.map(({ properties }: any) => csvHeaders.map(property => properties[property]).join(';'))].join('\n')

      const link = document.createElement('a')
      link.href = 'data:text/csv,' + encodeURIComponent(csvString)
      link.download = 'deploiement-bal.csv'
      link.click()
    }
    catch (error) {
      console.error(error)
    }
    finally {
      setIsDownloadingData(false)
    }
  }

  const handleDownloadGeoJSON = async () => {
    try {
      setIsDownloadingData(true)
      const url = new URL(`${window.location.origin}/api/deploiement-stats`)
      url.searchParams.append('codesCommune', filteredCodesCommmune.toString())

      const response = await customFetch(url)

      const link = document.createElement('a')
      link.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(response, null, 2))
      link.download = 'deploiement-bal.json'
      link.click()
    }
    catch (error) {
      console.error(error)
    }
    finally {
      setIsDownloadingData(false)
    }
  }

  return (
    <StyledWrapper>
      <div className="download-wrapper">
        <label>Télécharger les données : </label>
        <Button disabled={!filter || isDownloadingData} type="button" onClick={handleDownloadCSV} iconId="fr-icon-download-fill">format CSV</Button>
        <Button disabled={!filter || isDownloadingData} type="button" onClick={handleDownloadGeoJSON} iconId="fr-icon-download-fill">format GéoJSON</Button>
      </div>
      <ListCommunes filteredCodesCommmune={filteredCodesCommmune} />
    </StyledWrapper>
  )
}
