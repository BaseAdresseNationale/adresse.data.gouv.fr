'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { groupBy } from 'lodash'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

import { getStatsBals, getBalsStatus } from '@/lib/api-mes-adresses'
import CommuneBALList from './CommuneBALList'
import styled from 'styled-components'
import { BaseAdresseLocale, BaseAdresseLocaleStatus } from '@/types/api-mes-adresses.types'
import { toolsColors } from '@/theme/theme'

ChartJS.register(ArcElement, Tooltip, Legend)

const options = {
  height: 50,
  width: 50,
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
    tooltip: {
      enabled: true,
    },
  },
}

const initialStats = {
  labels: [
    'Publiée',
    'Brouillon',
  ],
  datasets: [{
    data: [0, 0, 0],
    backgroundColor: [
      toolsColors.mesAdresses,
      `${toolsColors.mesAdresses}80`,
    ],
    hoverOffset: 4,
  }],
}

const StyledWrapper = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-around;
  
`

interface TabMesAdressesProps {
  filteredCodesCommmune: string[]
}

export default function TabMesAdresses({ filteredCodesCommmune }: TabMesAdressesProps) {
  const [bals, setBals] = useState<Partial<BaseAdresseLocale>[]>([])
  const [dataStats, setDataStats] = useState(initialStats)

  const setDataStatsWithBal = useCallback((data: any) => {
    setDataStats((dataStats) => {
      return {
        ...dataStats,
        datasets: [
          {
            ...dataStats.datasets[0],
            data,
          },
        ],
      }
    })
  }, [])

  useEffect(() => {
    async function loadBalsStatus() {
      const balsStatus = await getBalsStatus()
      const statusData = [
        balsStatus.find(({ status }: Partial<BaseAdresseLocale>) => status === BaseAdresseLocaleStatus.PUBLISHED)?.count || 0,
        balsStatus.find(({ status }: Partial<BaseAdresseLocale>) => status === BaseAdresseLocaleStatus.DRAFT)?.count || 0,
      ]
      setDataStatsWithBal(statusData)
    }

    async function loadBals() {
      const fields = ['id', 'commune', 'status', 'nom', 'updatedAt', 'sync']
      const balsFiltered = await getStatsBals(fields, filteredCodesCommmune)
      setBals(balsFiltered)
      const statusData = [
        balsFiltered.filter(({ status }) => status === BaseAdresseLocaleStatus.PUBLISHED).length,
        balsFiltered.filter(({ status }) => status === BaseAdresseLocaleStatus.DRAFT).length,
      ]
      setDataStatsWithBal(statusData)
    }

    if (filteredCodesCommmune.length <= 0) {
      loadBalsStatus()
    }
    else {
      loadBals()
    }
  }, [filteredCodesCommmune, setDataStatsWithBal])

  const balsByCommune = useMemo(() => {
    return groupBy(bals, 'commune')
  }, [bals])

  return (
    <StyledWrapper>
      <div>
        <h3>Statut des BAL(s)</h3>
        <Doughnut data={dataStats} options={options} />
      </div>
      <div>
        <h3>Liste des Communes</h3>
        {filteredCodesCommmune.length > 0
          ? (
              <div>
                {Object.keys(balsByCommune).map((codeCommune) => {
                  const balsCommune = balsByCommune[codeCommune] || []
                  return <CommuneBALList key={codeCommune} codeCommune={codeCommune} balsCommune={balsCommune} />
                })}
              </div>
            )
          : (
              <p>Aucun Département ou EPCI sélectionné</p>
            )}
      </div>
    </StyledWrapper>
  )
}
