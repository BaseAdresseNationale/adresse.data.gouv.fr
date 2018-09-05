import React from 'react'
import PropTypes from 'prop-types'

import Item from './item'

const getStatus = item => {
  let status = null

  if (item.deleted) {
    status = 'deleted'
  } else if (item.created) {
    status = 'created'
  } else if (item.edited) {
    status = 'edited'
  }

  return status
}

class numerosList extends React.Component {
  static propTypes = {
    codeCommune: PropTypes.string.isRequired,
    codeVoie: PropTypes.string.isRequired,
    numeros: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      cancelChange: PropTypes.func.isRequired,
      deleteItem: PropTypes.func.isRequired,
      select: PropTypes.func.isRequired
    }).isRequired
  }

  render() {
    const {codeCommune, codeVoie, numeros, actions} = this.props
    const {cancelChange, deleteItem, select} = actions

    return (
      <div>
        {Object.keys(numeros).map(n => {
          const numero = numeros[n]
          return (
            <Item
              key={n}
              name={numero.numeroComplet}
              status={getStatus(numero)}
              handleClick={() => select(codeCommune, codeVoie, numero.numeroComplet)}
              actions={[
                numero.deleted ?
                  {type: 'cancel', func: () => cancelChange(numero)} :
                  {type: 'delete', func: () => deleteItem(numero)}
              ]}
            />
          )
        })}
      </div>
    )
  }
}

export default numerosList
