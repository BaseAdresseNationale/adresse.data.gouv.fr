import PropTypes from 'prop-types'

import theme from '@/styles/theme'

function NumberCard({label, number, color, size}) {
  return (
    <div className='number-card'>
      <div>{number}</div>
      <div>{label}</div>

      <style jsx>{`
        .number-card {
          background: ${color === 'primary' ? theme.backgroundGrey : theme.backgroundWhite};
          border: ${color === 'primary' ? 'none' : `${theme.primary} 3px solid`};
          border-radius: 5px;
          font-weight: bold;
          padding: ${size === 'regular' ? '2em' : '.5em 0'};
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: ${size === 'regular' ? '1.5em' : '5px'};
        }

        .number-card div:first-child {
          color: ${theme.primary};
          font-size: ${size === 'regular' ? 'xx-large' : 'x-large'};
        }

        .number-card div:last-child {
          font-size: ${size === 'regular' ? 'x-large' : 'medium'};
        }
      `}</style>
    </div>
  )
}

NumberCard.propTypes = {
  label: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  color: PropTypes.oneOf([
    'primary',
    'secondary'
  ]),
  size: PropTypes.oneOf([
    'regular',
    'small'
  ])
}

NumberCard.defaultProps = {
  color: 'primary',
  size: 'regular'
}

export default NumberCard
