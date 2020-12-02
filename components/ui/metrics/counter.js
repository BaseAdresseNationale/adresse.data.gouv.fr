import React from 'react'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

import {formatPercent, formatInteger} from '@/lib/format-numbers'

function Counter({value, label, unit, size, color, title}) {
  return (
    <div style={{textAlign: 'center'}}>
      {title && <div style={{margin: '1em 0'}}>{title}</div>}
      <div className={`value ${color}`}>
        {unit && unit === '%' ?
          formatPercent(value) :
          formatInteger(value) || 0}{unit && <span className='unit'>{unit}</span>}
      </div>
      {label && <div className={size}>{label}</div>}

      <style jsx>{`
      .value {
        font-size: 1.6rem;
        line-height: 1;
      }

      .unit {
        font-size: 0.5rem;
        margin-left: 0.1rem;
      }

      .success {
        color: ${theme.colors.green};
      }

      .warning {
        color: ${theme.colors.orange};
      }

      .error {
        color: ${theme.colors.red};
      }

      .small {
        font-size: 0.4rem;
        line-height: 1;
      }

      @media (max-width: 551px) {
        .small {
          font-size: 0.3rem;
        }
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
