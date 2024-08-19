export function getNumeroComplet({numero, suffixe}) {
  const suffixeTrim = suffixe?.trim() // Supprime les espaces en début et fin de chaîne
  const suffixeCode = suffixeTrim?.codePointAt(0) || null

  // Check if suffixeCode is a String number
  if (suffixeCode > 47 && suffixeCode < 58) {
    return `${numero}-${suffixeTrim || ''}`
  }

  if (suffixeTrim && suffixeTrim.length === 1) {
    return `${numero}${suffixeTrim}`
  }

  return `${numero} ${suffixeTrim || ''}`
}

export function isCOM(codeCommune) {
  const prefix2 = codeCommune.slice(0, 2)
  const prefix3 = codeCommune.slice(0, 3)

  return prefix2 > '97' || (prefix2 === '97' && !['971', '972', '973', '974', '976'].includes(prefix3))
} // Quick fix to check if the address is a COM or not. Will be change at this issue resolution => https://github.com/etalab/api-geo/issues/154

/**
 * Eligible au certificat de numerotage
 * @param {*} numero (sources liste, certifie bool, parecelle liste)
 * @returns bool
 */
export function isNumeroCertifiable({banId, sources, certifie, parcelles}) {
  return (
    // Check has banId
    banId &&
    // Check is bal
    sources?.includes('bal') &&
    // Check is certifié
    certifie &&
    // Check has parcelle
    parcelles?.length > 0
  )
}

export function orderBySuffixe(numeros) {
  const suffixes = [
    'bis',
    'ter',
    'quater',
    'quinquies',
    'sexies',
    'septies',
    'octies',
    'nonies',
    'decies'
  ]

  return numeros.sort((a, b) => {
    const numeroA = a.numero
    const numeroB = b.numero

    if (numeroA !== numeroB) {
      return numeroA - numeroB
    }

    const suffixA = a.suffixe ? a.suffixe.toLowerCase() : null
    const suffixB = b.suffixe ? b.suffixe.toLowerCase() : null

    if (suffixA === null) {
      return -1
    }

    if (suffixB === null) {
      return 1
    }

    const indexA = suffixes.includes(suffixA) ? suffixes.indexOf(suffixA) : Number.MAX_SAFE_INTEGER
    const indexB = suffixes.includes(suffixB) ? suffixes.indexOf(suffixB) : Number.MAX_SAFE_INTEGER
    return indexA - indexB
  })
}
