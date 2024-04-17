import PropTypes from 'prop-types'

const humanizeNumber = value => Number.isNaN(value) ? value : value.toLocaleString(undefined, {minimumFractionDigits: 0})

export default function ChartsCustomTooltip({active, payload, label: labelProp}) {
  if (active && payload && payload.length > 0) {
    const {label, toolipLabel, period, total, ...otherFields} = payload[0].payload || {}
    const [year, month = 0, day = 0] = period.split('-')
    const date = new Date(year, month - 1, day || 1)
    const dateFormat = {year: 'numeric', ...(month ? {month: 'long'} : {}), ...(day ? {day: 'numeric'} : {})}
    const fieldsList = Object.keys(otherFields)
    const filtredFields = payload.filter(({name}) => fieldsList.includes(name))

    return (
      <>
        <div className='custom-tooltip'>
          <p><span className='label'>{date.toLocaleDateString('fr-FR', dateFormat)}</span></p>
          <h5>{`${toolipLabel || label || labelProp}${total ? `${'\u00A0'}: ${humanizeNumber(total)}` : ''}`}</h5>
          <ul>{filtredFields.map(({name, value, color}) => (
            <li key={name} style={{color}}>{`${name} : ${humanizeNumber(Number(value))}`}</li>
          ))}</ul>
        </div>

        <style jsx>{`
          .custom-tooltip {
            background-color: white;
            border: 1px solid #ccc;
            padding: 10px;
          }
          .label {
            font-weight: bold;
          }
          .desc {
            font-style: italic;
          }
      `}</style>
      </>
    )
  }

  return null
}

ChartsCustomTooltip.propTypes = {
  active: PropTypes.bool, // eslint-disable-line react/boolean-prop-naming
  payload: PropTypes.object,
  label: PropTypes.string,
}
