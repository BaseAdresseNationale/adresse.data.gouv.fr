function getNumeroPositions(numero) {
  return numero.edited ? numero.modified.positions : numero.positions
}

export function getNumeroPosition(numero) {
  if (numero.position) {
    return numero.position // For /explore model
  }

  const positions = getNumeroPositions(numero)
  return positions ? positions[0] : null
}

export function hasPosition(numero) {
  const positions = getNumeroPositions(numero)

  return positions && positions.length > 0
}
