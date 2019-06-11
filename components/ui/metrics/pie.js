import React from 'react'
import PropTypes from 'prop-types'
import {Pie} from 'react-chartjs-2'

const formatData = (data, colors) => {
  const labels = Object.keys(data).sort((a, b) => data[a] < data[b])

  return {
    labels: labels.map(label => label),
    datasets: [
      {
        data: labels.map(label => data[label]),
        backgroundColor: colors
      }
    ]
  }
}

export const PieChart = ({title, data, colors}) => {
  const formatedData = formatData(data, colors)

  if (formatedData.labels.length === 0) {
    return (
      <div>Aucune donnée</div>
    )
  }

  return (
    <div style={{textAlign: 'center'}}>
      {title && <div style={{margin: '1em 0'}}>{title}</div>}

      <div>
        <Pie
          data={formatedData}
          options={{
            maintainAspectRatio: false
          }}
        />
      </div>
    </div>
  )
}

PieChart.propTypes = {
  title: PropTypes.string,
  data: PropTypes.object,
  colors: PropTypes.array
}

PieChart.defaultProps = {
  title: null,
  data: {},
  colors: [
    '#2185D0',
    '#00B5AD',
    '#21BA45',
    '#FBBD08',
    '#A333C8',
    '#e03997',
    '#F2711C',
    '#DB2828',
    '#a5673f',
    '#DDDDDD',
    '#000000'
  ]
}

export default PieChart
