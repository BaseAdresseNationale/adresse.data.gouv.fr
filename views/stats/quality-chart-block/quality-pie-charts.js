import PropTypes from 'prop-types'
import {ResponsiveContainer, PieChart, Pie, Cell} from 'recharts'

function QualityPieCharts({data, size = 200, pieThicknesses = [16, 20], pieGap: propsPieGap = 4, color = '#aaa'}) {
  const pieGap = propsPieGap * pieThicknesses.length
  const pieOuterRadius = size / 2
  const paddingAngle = propsPieGap / 2

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <PieChart width={size} height={size}>
        <Pie
          data={data[0]}
          innerRadius={pieOuterRadius - pieThicknesses[0] - pieGap - pieThicknesses[1]}
          outerRadius={pieOuterRadius - pieThicknesses[0] - pieGap}
          fill={color}
          paddingAngle={paddingAngle}
          dataKey='value'
        >
          {data[0].map(({name, color}) => (
            <Cell key={`cell-0-${name}`} fill={color} />
          ))}
        </Pie>

        <Pie
          data={data[1]}
          innerRadius={pieOuterRadius - pieThicknesses[1]}
          outerRadius={pieOuterRadius}
          fill={color}
          paddingAngle={paddingAngle}
          dataKey='value'
        >
          {data[1].map(({name, color}) => (
            <Cell key={`cell-1-${name}`} fill={color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

QualityPieCharts.propTypes = {
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    description: PropTypes.string,
  }))).isRequired,
  size: PropTypes.number,
  pieThicknesses: PropTypes.arrayOf(PropTypes.number),
  pieGap: PropTypes.number,
  color: PropTypes.string,
}

export default QualityPieCharts
