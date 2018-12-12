import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../styles/theme'

const MAX_SAFE_INTEGER = 9007199254740991

function formatInteger(number) {
  const absoluteValue = Math.abs(number)

  if (absoluteValue > MAX_SAFE_INTEGER) {
    throw new Error('Integer is out of bounds')
  }

  if (absoluteValue < 10000) {
    return absoluteValue.toString()
  }

  const chars = String(absoluteValue).split('')
  const uncompleteGroupSize = chars.length % 3
  const numCompleteGroups = (chars.length - uncompleteGroupSize) / 3
  const groups = []

  if (uncompleteGroupSize > 0) {
    groups.push(chars.slice(0, uncompleteGroupSize).join(''))
  }

  let i = 0
  while (i < numCompleteGroups) {
    const from = uncompleteGroupSize + (i * 3)
    const to = from + 3
    const group = chars.slice(from, to).join('')

    groups.push(group)
    i++
  }

  return groups.join(' ')
}

function formatPercent(percent) {
  if (Number(percent) === percent && percent % 1 !== 0) {
    const fixed = Number.parseFloat(percent).toFixed(2)
    return String(fixed).replace('.', ',')
  }

  return percent
}

const Counter = ({value, label, unit, size, color, title}) => (
  <div>
    {title && <h3>{title}</h3>}
    <div className={`value ${color}`}>
      {unit && unit === '%' ?
        formatPercent(value) :
        formatInteger(value) || 0}{unit && <span className='unit'>{unit}</span>}
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
        color: ${theme.colors.orange};
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
