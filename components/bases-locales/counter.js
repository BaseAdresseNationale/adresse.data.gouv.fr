import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../styles/theme'

const Counter = ({value, label, unit, size, color, title}) => (
  <div>
    {title && <h3>{title}</h3>}
    <div className={`value ${color}`}>
      {value.toLocaleString() || 0}{unit && <span className='unit'>{unit}</span>}
    </div>
    {label && <div className={size}>{label}</div>}

    <style jsx>{`
      .value {
        font-size: 2.2rem;
        line-height: 1;
      }
      .unit {
        font-size: 1rem;
        margin-left: 0.2rem;
      }

      .success {
        color: ${theme.colors.green};
      }
      .warning {
        color: ${theme.colors.yellow};
      }
      .error {
        color: ${theme.colors.red};
      }

      .small {
        font-size: 0.8rem;
        line-height: 1;
      }

      @media (max-width: 551px) {
        .small {
          font-size: 0.6rem;
        }
      }
    `}</style>
  </div>
)

Counter.propTypes = {
  value: PropTypes.number.isRequired,
  label: PropTypes.string,
  unit: PropTypes.string,
  title: PropTypes.string,
  size: PropTypes.oneOf([
    '',
    'small'
  ]),
  color: PropTypes.oneOf([
    '',
    'success',
    'warning',
    'error'
  ])
}

Counter.defaultProps = {
  label: null,
  unit: null,
  title: null,
  size: '',
  color: ''
}

export default Counter
