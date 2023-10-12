import PropTypes from 'prop-types'

function AxisTickByDate({x, y, payload}) {
  const [year, month, day] = payload.value.split('-')

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor='end' fill='#666' transform='rotate(-35)'>
        {
          day ?
            `${day}/${month}/${year}` :
            (new Date(year, month - 1, day || 1)).toLocaleDateString('fr-FR', {year: 'numeric', month: 'short'})
        }
      </text>
    </g>
  )
}

AxisTickByDate.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.object,
}

export default AxisTickByDate
