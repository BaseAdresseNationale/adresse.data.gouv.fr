import PropTypes from 'prop-types'
import theme from '@/styles/theme'
import {formatPercent, formatInteger} from '@/lib/format-numbers'

function Counter({value, label, unit, size, color}) {
  return (
    <div className='counter-container'>
      <div className='value'>
        {unit && unit === '%' ? formatPercent(value) : formatInteger(value) || 0}
        {unit && <span className='unit'>{unit}</span>}
      </div>
      {label && <div className='label'>{label}</div>}

      <style jsx>{`
        .counter-container {
          background: ${color === 'primary' ? theme.backgroundGrey : theme.backgroundWhite};
          border: ${color === 'primary' ? 'none' : `${theme.primary} 3px solid`};
          border-radius: 5px;
          font-weight: bold;
          display: flex;
          padding: ${size === 'small' ? '.5em 0' : '2em'};
          gap: ${size === 'small' ? '5px' : '1.5em'};
          flex-direction: column;
          align-items: center;
        }

        .value {
          color: ${theme.primary};
          font-size: ${size === 'small' ? 'x-large' : 'xx-large'};
        }

        .label {
          margin: 0;
          padding: 0;
          background: none;
          font-size: ${size === 'small' ? 'medium' : 'x-large'};
        }

        .unit {
          margin-left: 0.1rem;
        }
      `}</style>
    </div>
  )
}

Counter.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  label: PropTypes.string,
  unit: PropTypes.string,
  size: PropTypes.oneOf([
    '',
    'small'
  ]),
  color: PropTypes.oneOf([
    'primary',
    'secondary'
  ]),
}

Counter.defaultProps = {
  label: null,
  unit: null,
  size: '',
  color: 'primary'
}

export default Counter
