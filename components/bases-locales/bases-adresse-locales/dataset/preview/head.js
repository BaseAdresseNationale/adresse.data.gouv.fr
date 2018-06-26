import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../styles/theme'

class Head extends React.Component {
  static propTypes = {
    counters: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired
      })
    ).isRequired
  }

  render() {
    const {counters} = this.props

    return (
      <div className='container'>
        {counters.map(counter => (
          <div key={counter.name}>{counter.name} : <b>{counter.value}</b></div>
        ))}
        <style jsx>{`
          .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: ${theme.primary};
            padding: 1em 2em;
            color: ${theme.colors.white};
          }

          @media (max-width: 420px) {
            .container {
              padding: 1em;
            }
          }
        `}</style>
      </div>
    )
  }
}

export default Head
