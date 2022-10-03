export function getNumeroComplet({numero, suffixe}) {
  const suffixeCode = suffixe?.codePointAt(0) || null

  // Check if suffixeCode is a String number
  if (suffixeCode > 47 && suffixeCode < 58) {
    return `${numero}-${suffixe || ''}`
  }

  return `${numero}${suffixe || ''}`
}

export function isCOM(codeCommune) {
  const prefix2 = codeCommune.slice(0, 2)
  const prefix3 = codeCommune.slice(0, 3)

  return prefix2 > '97' || (prefix2 === '97' && !['971', '972', '973', '974', '976'].includes(prefix3))
} // Quick fix to check if the address is a COM or not. Will be change at this issue resolution => https://github.com/etalab/api-geo/issues/154
