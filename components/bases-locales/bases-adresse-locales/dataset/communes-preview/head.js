import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../styles/theme'

class Head extends React.Component {
  static propTypes = {
    communes: PropTypes.number.isRequired,
    voies: PropTypes.number.isRequired,
    addresses: PropTypes.number.isRequired
  }

  render() {
    const {communes, voies, addresses} = this.props

    return (
      <div className='container'>
        <div>Communes : <b>{communes}</b></div>
        <div>Voies : <b>{voies}</b></div>
        <div>Adresses : <b>{addresses}</b></div>
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
