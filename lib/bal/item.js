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

export const getType = item => {
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

export const getName = item => {
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

export const getCode = item => {
  return item.code || item.id || item.codeVoie
}
