import React from 'react'
import PropTypes from 'prop-types'
import {Pie} from 'react-chartjs-2'

const colors = [
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

const formatData = data => {
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

export const PieChart = ({data}) => {
  const formatedData = formatData(data)

  if (formatedData.labels.length === 0) {
    return (
      <div>Aucune donnée</div>
    )
  }

  return (
    <Pie
      data={formatedData}
      options={{
        maintainAspectRatio: false
      }}
    />
  )
}

PieChart.propTypes = {
  data: PropTypes.object
}

PieChart.defaultProps = {
  data: {}
}

export default PieChart
