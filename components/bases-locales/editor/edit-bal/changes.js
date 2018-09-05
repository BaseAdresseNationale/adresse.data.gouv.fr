import React from 'react'
import PropTypes from 'prop-types'

import ChangesItem from './item/changes-item'

const plural = array => {
  return array.length > 1 ? 's' : ''
}

const getId = item => {
  return item.code || item.idVoie || item.id
}

class Changes extends React.Component {
  static propTypes = {
    changes: PropTypes.shape({
      communes: PropTypes.array.isRequired,
      voies: PropTypes.array.isRequired,
      numeros: PropTypes.array.isRequired
    }).isRequired,
    cancelChange: PropTypes.func.isRequired,
    changeContext: PropTypes.func.isRequired
  }

  render() {
    const {changes, changeContext, cancelChange} = this.props
    const {communes, voies, numeros} = changes

    return (
      <div>
        <h2>Changements</h2>

        {communes.length && (
          <div>
            <h4>Commune{plural(communes)}</h4>
            {communes.map(commune => (
              <ChangesItem
                key={getId(commune)}
                item={commune}
                changeContext={changeContext}
                cancelChange={cancelChange}
              />
            ))}
          </div>
        )}

        {voies.length && (
          <div>
            <h4>Voie{plural(voies)}</h4>
            {voies.map(voie => (
              <ChangesItem
                key={getId(voie)}
                item={voie}
                changeContext={changeContext}
                cancelChange={cancelChange}
              />
            ))}
          </div>
        )}

        {numeros.length && (
          <div>
            <h4>Numéro{plural(numeros)}</h4>
            {numeros.map(numero => (
              <ChangesItem
                key={getId(numero)}
                item={numero}
                changeContext={changeContext}
                cancelChange={cancelChange}
              />
            ))}
          </div>
        )}

      </div>
    )
  }
}

export default Changes
