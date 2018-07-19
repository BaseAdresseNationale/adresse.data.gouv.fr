import React from 'react'
import PropTypes from 'prop-types'

import Item from '.'

const getName = item => {
  return item.nom || item.nomVoie || item.numeroComplet
}

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

const hasChild = item => {
  return (item.idVoie && item.numeros) || (item.code && item.voies)
}

const getChilds = item => {
  const childs = item.voies || item.numeros
  switch (childs.length) {
    case 0:
      return `Aucun${item.idVoie ? 'e voie' : ' numéro'}`
    case 1:
      return `1 ${item.idVoie ? 'voie' : 'numéro'}`
    default:
      return `${childs.length} ${item.idVoie ? 'voie' : 'numéro'}s`
  }
}

class ChangesItem extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    changeContext: PropTypes.func.isRequired,
    cancelChanges: PropTypes.func.isRequired
  }

  render() {
    const {item, cancelChanges, changeContext} = this.props

    return (
      <Item
        name={getName(item)}
        childs={hasChild(item) ? getChilds(item) : 'Toponyme'}
        status={getStatus(item)}
        handleClick={() => changeContext(item)}
        actions={[{type: 'cancel', func: () => cancelChanges(item)}]}
      />
    )
  }
}

export default ChangesItem
