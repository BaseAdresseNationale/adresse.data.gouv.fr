import PropTypes from 'prop-types'
import {groupBy} from 'lodash'
import {Doughnut} from 'react-chartjs-2'
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'

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

function PanelBal({filteredCodesCommmune, bals}) {
  const balsByCommune = groupBy(bals, 'commune')

  const data = {
    labels: [
      'Publiée',
      'Prête à être publiée',
      'Brouillon'
    ],
    datasets: [{
      data: [
        bals?.filter(bal => bal.status === 'published')?.length,
        bals?.filter(bal => bal.status === 'ready-to-publish')?.length,
        bals?.filter(bal => bal.status === 'draft')?.length
      ],
      backgroundColor: [
        '#228833',
        '#AA3377',
        '#EE6677'
      ],
      hoverOffset: 4
    }]
  }

  return (
    <div>
      <br />
      {filteredCodesCommmune.length > 0 ? (
        <div>
          <h3>Statut des BAL(s)</h3>
          <div className='donut'>
            <Doughnut data={data} options={options} />
          </div>
          <br />
          <h3>Liste des Communes</h3>

          {filteredCodesCommmune.map(codeCommune => {
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
        .donut {
          border: 1px solid lightgrey;
          padding: 1em;
          border-radius: 5px;
          max-width: 300px;
        }
      `}</style>
    </div>
  )
}

PanelBal.propTypes = {
  filteredCodesCommmune: PropTypes.array.isRequired,
  bals: PropTypes.array.isRequired
}

export default PanelBal
