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

/**
 * Eligible au certificat de numerotage
 * @param {*} numero (sources liste, certifie bool, parecelle liste)
 * @returns bool
 */
export function isCertifiable({sources, certifie, parcelles}) {
  return (
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
    'decies',
    'undecies',
    'duodecies',
    'terdecies',
    'quaterdecies',
    'quindecies',
    'sexdecies',
    'septdecies',
    'octodecies',
    'novodecies',
    'vicies',
    'unvicies',
    'duovicies',
    'tervicies',
    'quatervicies',
    'quinvicies',
    'sexvicies',
    'septvicies',
    'octovicies',
    'novovicies',
    'tricies',
    'untricies',
    'duotricies',
    'tertricies',
    'quatertricies',
    'quintricies',
    'sextricies',
    'septtricies',
    'octotricies',
    'novotricies',
    'quadragies',
    'unquadragies',
    'duoquadragies',
    'terquadragies',
    'quaterquadragies',
    'quinquadragies',
    'sexquadragies',
    'septquadragies',
    'octoquadragies',
    'novoquadragies',
    'quinquagies',
    'unquinquagies',
    'duoquinquagies',
    'terquinquagies',
    'quaterquinquagies',
    'quinquinquagies',
    'sexquinquagies',
    'septquinquagies',
    'octoquinquagies',
    'novoquinquagies',
    'sexagies',
    'unsexagies',
    'duosexagies',
    'tersexagies',
    'quatersexagies',
    'quinsexagies',
    'sexsexagies',
    'septsexagies',
    'octosexagies',
    'novosexagies'
  ]

  const suffixOrderMap = {}

  let index = 0
  for (const suffix of suffixes) {
    suffixOrderMap[suffix] = index
    index++
  }

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

    const indexA = suffixOrderMap[suffixA] === undefined ? Number.MAX_SAFE_INTEGER : suffixOrderMap[suffixA]
    const indexB = suffixOrderMap[suffixB] === undefined ? Number.MAX_SAFE_INTEGER : suffixOrderMap[suffixB]
    return indexA - indexB
  })
}
