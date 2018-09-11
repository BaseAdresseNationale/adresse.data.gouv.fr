import React from 'react'
import PropTypes from 'prop-types'

import NumeroItem from './numero-item'

class NumerosList extends React.Component {
  static propTypes = {
    codeCommune: PropTypes.string.isRequired,
    codeVoie: PropTypes.string.isRequired,
    numeros: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  }

  render() {
    const {codeCommune, codeVoie, numeros, actions} = this.props

    return (
      <div>
        {Object.keys(numeros).map(n => {
          const numero = numeros[n]
          return (
            <NumeroItem
              key={n}
              codeCommune={codeCommune}
              codeVoie={codeVoie}
              numero={numero}
              actions={actions}
            />
          )
        })}
      </div>
    )
  }
}

export default NumerosList
