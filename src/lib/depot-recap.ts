const LEGACY_MES_ADRESSES = new Set(['mes-adresses'])
const LEGACY_MOISSONNEUR = new Set(['moissonneur-bal', 'guichet-adresse'])

export type ClientDepotRaw = {
  id: string
  nom?: string
  legacyId?: string
  authorizationStrategy?: string
  mandataireId?: string
  chefDeFileId?: string
  active?: boolean
  isActive?: boolean
}

export type ChefDeFileDepotRaw = {
  id: string
  nom?: string
}

export type ClientRecapItem = {
  client_id: string
  mode: string
  nom_affichage: string
}

function getModeEtLibelle(
  c: ClientDepotRaw,
  chefs: Record<string, ChefDeFileDepotRaw>,
): [mode: string, nom_affichage: string] {
  const legacy = c.legacyId
  const nom = (c.nom ?? '').trim()
  const strat = c.authorizationStrategy

  if (legacy && LEGACY_MES_ADRESSES.has(legacy)) {
    return ['Mes Adresses', nom || 'Mes Adresses']
  }
  if (legacy === 'formulaire-publication') {
    return ['Formulaire de publication', nom || 'Formulaire de publication']
  }
  if ((legacy && LEGACY_MOISSONNEUR.has(legacy)) || strat === 'internal') {
    return ['Moissonneur BAL', nom || 'Moissonneur BAL']
  }
  const cdf = chefs[c.chefDeFileId ?? ''] ?? {}
  const nomCdf = (cdf.nom ?? '').trim()
  const libelle = nom && nomCdf ? `${nom} - ${nomCdf}` : (nom || nomCdf || 'API Dépôt')
  return ['API Dépôt', libelle]
}

export function getClientsRecap(
  clients: ClientDepotRaw[],
  chefsDeFile: ChefDeFileDepotRaw[],
): ClientRecapItem[] {
  const chefsById: Record<string, ChefDeFileDepotRaw> = {}
  for (const c of chefsDeFile) {
    chefsById[c.id] = c
  }

  const activeClients = clients.filter(c => c.active !== false && c.isActive !== false)

  const libelleCounts: Record<string, number> = {}
  for (const c of activeClients) {
    const [mode, libelle] = getModeEtLibelle(c, chefsById)
    const key = `${mode}\0${libelle}`
    libelleCounts[key] = (libelleCounts[key] ?? 0) + 1
  }

  const items: ClientRecapItem[] = activeClients.map((c) => {
    const [mode, libelle] = getModeEtLibelle(c, chefsById)
    const key = `${mode}\0${libelle}`
    const nomAffichage = libelleCounts[key] > 1 ? `${libelle} (${c.id.slice(-6)})` : libelle
    return { client_id: c.id, mode, nom_affichage: nomAffichage }
  })

  return items.sort((a, b) => {
    if (a.mode !== b.mode) return a.mode.localeCompare(b.mode)
    return a.nom_affichage.localeCompare(b.nom_affichage)
  })
}

export const RECAP_MODE = {
  MES_ADRESSES: 'Mes Adresses',
  MOISSONNEUR_BAL: 'Moissonneur BAL',
  FORMULAIRE_PUBLICATION: 'Formulaire de publication',
  API_DEPOT: 'API Dépôt',
} as const

export function getClientIdsByMode(recap: ClientRecapItem[], mode: string): string[] {
  return recap.filter(item => item.mode === mode).map(item => item.client_id)
}
