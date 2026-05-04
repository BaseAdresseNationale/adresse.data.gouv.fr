const COLLECTIVITE_FR_ORIGIN = 'https://collectivite.fr'

export function collectiviteFrCommuneAuthUrl(nomCommune: string | undefined): string {
  if (!nomCommune?.trim()) {
    return COLLECTIVITE_FR_ORIGIN
  }
  const slug = nomCommune
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  if (!slug) {
    return COLLECTIVITE_FR_ORIGIN
  }
  return `${COLLECTIVITE_FR_ORIGIN}/${slug}/auth`
}
