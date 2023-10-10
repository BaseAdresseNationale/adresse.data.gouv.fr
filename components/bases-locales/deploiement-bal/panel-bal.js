import PropTypes from 'prop-types'
import {useEffect, useState, useMemo, useCallback} from 'react'
import {groupBy} from 'lodash'
import {Doughnut} from 'react-chartjs-2'
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'

import theme from '@/styles/theme'
import {getBals, getBalsStatus} from '@/lib/mes-adresse-api'
import CommuneBALList from './commune-bal-list'

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
      enabled: true
    }
  }
}

const initialStats = {
  labels: [
    'Publiée',
    'Prête à être publiée',
    'Brouillon'
  ],
  datasets: [{
    data: [0, 0, 0],
    backgroundColor: [
      theme.colors.mapGreen,
      theme.colors.mapBlue,
      theme.colors.mapYellow
    ],
    hoverOffset: 4
  }]
}

function PanelBal({filteredCodesCommmune}) {
  const [bals, setBals] = useState([])
  const [dataStats, setDataStats] = useState(initialStats)

  useEffect(() => {
    async function loadBalsStatus() {
      const balsStatus = await getBalsStatus()
      const statusData = [
        balsStatus.find(({status}) => status === 'published')?.count || 0,
        balsStatus.find(({status}) => status === 'ready-to-publish')?.count || 0,
        balsStatus.find(({status}) => status === 'draft')?.count || 0,
      ]
      setDataStatsWithBal(statusData)
    }

    async function loadBals() {
      const fields = ['_id', 'commune', 'status', 'nom', '_updated', 'sync']
      const balsFiltered = await getBals(fields, filteredCodesCommmune)
      setBals(balsFiltered)
      const statusData = [
        balsFiltered.filter(({status}) => status === 'published').length,
        balsFiltered.filter(({status}) => status === 'ready-to-publish').length,
        balsFiltered.filter(({status}) => status === 'draft').length
      ]
      setDataStatsWithBal(statusData)
    }

    if (filteredCodesCommmune.length <= 0) {
      loadBalsStatus()
    } else {
      loadBals()
    }
  }, [filteredCodesCommmune, setDataStatsWithBal])

  const balsByCommune = useMemo(() => {
    return groupBy(bals, 'commune')
  }, [bals])

  const setDataStatsWithBal = useCallback(data => {
    setDataStats(dataStats => {
      return {
        ...dataStats,
        datasets: [
          {
            ...dataStats.datasets[0],
            data
          }
        ]
      }
    })
  }, [])

  return (
    <div>
      <br />
      <h3>Statut des BAL(s)</h3>
      <div className='stats'>
        <div className='donut'>
          <Doughnut data={dataStats} options={options} />
        </div>
      </div>
      <br />
      <h3>Liste des Communes</h3>
      {filteredCodesCommmune.length > 0 ? (
        <div>
          {Object.keys(balsByCommune).map(codeCommune => {
            const balsCommune = balsByCommune[codeCommune] || []
            return <CommuneBALList key={codeCommune} codeCommune={codeCommune} balsCommune={balsCommune} />
          })}
        </div>
      ) : (
        <p>Aucun Département ou EPCI sélectionné</p>
      )}
      <style jsx>{`
        h3 {
          text-align: left;
        }
        .stats {
          border: 1px solid lightgrey;
          padding: 1em;
          border-radius: 5px;
          display: flex;
          justify-content: center;
        }
        .donut {
          width: 60%;
        }
      `}</style>
    </div>
  )
}

PanelBal.propTypes = {
  filteredCodesCommmune: PropTypes.array.isRequired,
}

export default PanelBal
