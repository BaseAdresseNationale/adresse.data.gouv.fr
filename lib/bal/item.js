export function getStatus(item) {
  let status = null

  if (item.edited) {
    status = 'edited'
  }

  if (item.deleted) {
    status = 'deleted'
  }

  if (item.created) {
    status = 'created'
  }

  return status
}

export function getType(item) {
  if (item.code) {
    return 'commune'
  }

  if (item.nomVoie) {
    return 'voie'
  }

  if (item.numeroComplet) {
    return 'numero'
  }
}

export function getName(item) {
  const type = getType(item)

  switch (type) {
    case 'commune':
      return item.nom
    case 'voie':
      return item.modified && item.modified.nomVoie ? item.modified.nomVoie : item.nomVoie
    case 'numero':
      return item.numeroComplet
    default:
      break
  }
}

export function getCode(item) {
  return item.code || item.id || item.codeVoie
}

export function getNumeroPos(numero) {
  if (numero.position) {
    return numero.position // For /explore model
  }

  const positions = numero.edited ? numero.modified.positions : numero.positions

  return positions ? positions[0] : null
}

export function getPosition(item) {
  return item.edited ? item.modified.position : item.position
}

export function hasPosition(numero) {
  const positions = numero.edited ? numero.modified.positions : numero.positions

  return positions.length > 0
}
