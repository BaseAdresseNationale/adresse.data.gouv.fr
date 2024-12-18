interface NumeroData {
  banId: string
  sources: string[]
  certifie: boolean
  parcelles: string[]
  withBanId: boolean
}

/**
   * Vérifie si un numéro est éligible pour un certificat de numérotation.
   * @param numeroData - Les données du numéro comprenant l'identifiant BAN, les sources, l'état de certification et les parcelles.
   * @returns boolean - Renvoie true si le numéro est éligible, false sinon.
   */
export function isAddressCertifiable(numeroData: NumeroData): boolean {
  const { banId, sources, certifie, parcelles, withBanId } = numeroData
  return (
    !!banId
    && sources?.includes('bal')
    && certifie
    && parcelles?.length > 0
    && withBanId
  )
}
