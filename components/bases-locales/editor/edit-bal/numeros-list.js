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
    numeros: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        numeroComplet: PropTypes.string.isRequired
      })
    ).isRequired,
    itemActions: PropTypes.shape({
      cancelChanges: PropTypes.func.isRequired,
      deleteItem: PropTypes.func.isRequired,
      changeContext: PropTypes.func.isRequired
    }).isRequired
  }

  render() {
    const {numeros, itemActions} = this.props
    const {cancelChanges, deleteItem, changeContext} = itemActions

    return (
      <div>
        {numeros.map(numero => (
          <Item
            key={numero.id}
            name={numero.numeroComplet}
            status={getStatus(numero)}
            handleClick={() => changeContext(numero)}
            actions={[
              numero.deleted ?
                {type: 'cancel', func: () => cancelChanges(numero)} :
                {type: 'delete', func: () => deleteItem(numero)}
            ]}
          />
        ))}
      </div>
    )
  }
}

export default numerosList
