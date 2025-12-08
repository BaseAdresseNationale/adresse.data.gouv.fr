'use client'

import DoughnutCounter from '@/components/ChartJS/DoughnutCounter'
import { DeploiementBALSearchResult } from '@/hooks/useStatsDeploiement'
import { customFetch } from '@/lib/fetch'
import { BANStats } from '@/types/api-ban.types'
import { numFormater } from '@/utils/number'
import Button from '@codegouvfr/react-dsfr/Button'
import { useState } from 'react'
import styled from 'styled-components'

const StyledWrapper = styled.div`
.stats {
    height: fit-content;
    display: grid;
    grid-template-columns: repeat( auto-fit, minmax(250px, 1fr) );
    gap: 1em;
    margin-top: 1em;
}

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

const options = {
  height: 200,
  width: 200,
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
  },
}

interface TabDeploiementBALProps {
  stats: BANStats
  formatedStats: any
  filteredCodesCommmune: string[]
  filter: DeploiementBALSearchResult | null
}

export default function TabDeploiementBAL({ stats, formatedStats, filteredCodesCommmune, filter }: TabDeploiementBALProps) {
  const [isDownloadingData, setIsDownloadingData] = useState(false)

  const {
    dataPopulationCouverte,
    communesCouvertesPercent,
    dataCommunesCouvertes,
    adressesGereesBALPercent,
    dataAdressesGereesBAL,
    adressesCertifieesPercent,
    dataAdressesCertifiees,
    communesAvecBanIdPercent,
    dataCommunesAvecBanId,
    adressesAvecBanIdPercent,
    dataAdressesAvecBanId,
    total,
  } = formatedStats

  const handleDownloadCSV = async () => {
    try {
      setIsDownloadingData(true)
      const url = new URL(`${window.location.origin}/api/deploiement-stats`)
      url.searchParams.append('codesCommune', filteredCodesCommmune.toString())

      const csvHeaders = ['code', 'nom', 'nbNumeros', 'certificationPercentage', 'hasBAL', 'nomClient']
      const response = await customFetch(url, { cache: 'force-cache' })
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

      const response = await customFetch(url, { cache: 'force-cache' })

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
      <div className="stats">
        {!Number.isNaN(adressesGereesBALPercent) && (
          <DoughnutCounter
            title="Adresses issues des BAL"
            valueUp={numFormater(stats.bal.nbAdresses)}
            valueDown={`${adressesGereesBALPercent}% des ${numFormater(stats.ban.nbAdresses)} d’adresses présentes dans la BAN`}
            data={dataAdressesGereesBAL}
            options={options}
          />
        )}
        <DoughnutCounter
          title="Communes couvertes"
          valueUp={numFormater(stats.bal.nbCommunesCouvertes)}
          valueDown={`${communesCouvertesPercent}% des ${numFormater(total.nbCommunes)} communes`}
          data={dataCommunesCouvertes}
          options={options}
        />
        <DoughnutCounter
          title="Population couverte"
          valueUp={numFormater(stats.bal.populationCouverte)}
          valueDown={`${Math.round((stats.bal.populationCouverte * 100) / total.population)}% des ${numFormater(total.population)} d’habitants`}
          data={dataPopulationCouverte}
          options={options}
        />
        {!Number.isNaN(adressesGereesBALPercent) && (
          <DoughnutCounter
            title="Adresses certifiées"
            valueUp={numFormater(stats.bal.nbAdressesCertifiees)}
            valueDown={`${adressesCertifieesPercent}% des ${numFormater(stats.ban.nbAdresses)} d’adresses présentes dans la BAN`}
            data={dataAdressesCertifiees}
            options={options}
          />
        )}
        <DoughnutCounter
          title="Communes avec identifiant BAN"
          valueUp={numFormater(stats.ban.nbCommunesAvecBanId)}
          valueDown={`${communesAvecBanIdPercent}% des ${numFormater(total.nbCommunes)} communes`}
          data={dataCommunesAvecBanId}
          options={options}
        />
        <DoughnutCounter
          title="Adresses avec identifiant BAN"
          valueUp={numFormater(stats.ban.nbAdressesAvecBanId)}
          valueDown={`${adressesAvecBanIdPercent}% des ${numFormater(stats.ban.nbAdresses)} d’adresses présentes dans la BAN`}
          data={dataAdressesAvecBanId}
          options={options}
        />
      </div>
      <div className="download-wrapper">
        <label>Télécharger les données : </label>
        <Button disabled={!filter || isDownloadingData} type="button" onClick={handleDownloadCSV} iconId="fr-icon-download-fill">format CSV</Button>
        <Button disabled={!filter || isDownloadingData} type="button" onClick={handleDownloadGeoJSON} iconId="fr-icon-download-fill">format GéoJSON</Button>
      </div>
    </StyledWrapper>
  )
}
