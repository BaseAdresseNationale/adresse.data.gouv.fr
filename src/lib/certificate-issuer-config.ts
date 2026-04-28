import type { BANConfig } from '@/types/api-ban.types'

/** Certificat PDF : champs vides/absents → défauts ; détail dans issuerPdfLinesFromInputs et withCertificateFieldDefaults. */

/** Limites config district (API BAN). */
export const DISTRICT_CONFIG_FIELD_LIMITS = {
  certificateIssuerDetails: 4000,
  certificateAttestationText: 20_000,
} as const

export const CERTIFICATE_ISSUER_DETAILS_MAX_INPUT_LINES = 5

export const CERTIFICATE_ISSUER_DETAILS_MAX_CHARS_PER_LOGICAL_LINE = 50

export function certificateIssuerDetailsEffectiveMaxChars(): number {
  return Math.min(
    DISTRICT_CONFIG_FIELD_LIMITS.certificateIssuerDetails,
    CERTIFICATE_ISSUER_DETAILS_MAX_INPUT_LINES * CERTIFICATE_ISSUER_DETAILS_MAX_CHARS_PER_LOGICAL_LINE + (CERTIFICATE_ISSUER_DETAILS_MAX_INPUT_LINES - 1),
  )
}

export const CERTIFICATE_ATTESTATION_TEXT_MAX_CHARS = DISTRICT_CONFIG_FIELD_LIMITS.certificateAttestationText

export const CERTIFICATE_ATTESTATION_MAX_INPUT_LINES = 4

export const CERTIFICATE_ATTESTATION_MAX_RAW_CHARS_PER_LOGICAL_LINE = 400

export function certificateAttestationEffectiveMaxChars(): number {
  return Math.min(
    DISTRICT_CONFIG_FIELD_LIMITS.certificateAttestationText,
    CERTIFICATE_ATTESTATION_MAX_INPUT_LINES * CERTIFICATE_ATTESTATION_MAX_RAW_CHARS_PER_LOGICAL_LINE + (CERTIFICATE_ATTESTATION_MAX_INPUT_LINES - 1),
  )
}

export const POPULATION_SEUIL_VILLE = 2000

export function isVilleParPopulation(population: number | undefined): boolean {
  return typeof population === 'number' && Number.isFinite(population) && population >= POPULATION_SEUIL_VILLE
}

export function getDefaultAttestationTemplate(population?: number): string {
  return isVilleParPopulation(population)
    ? 'La ville de {commune} atteste que l\'adresse ci-dessous est certifiée dans la Base Adresse Nationale à la date du {date}.'
    : 'La commune de {commune} atteste que l\'adresse ci-dessous est certifiée dans la Base Adresse Nationale à la date du {date}.'
}

export const CERTIFICATE_ATTESTATION_DEFAULT_TEMPLATE = getDefaultAttestationTemplate()

/** Texte attestation non vide : doit contenir {commune} et {date}. */
export function getCertificateAttestationPlaceholderError(
  certificateAttestationText: string | null | undefined,
): string | null {
  if (certificateAttestationText == null) return null
  const t = certificateAttestationText.trim()
  if (t.length === 0) return null
  if (t.includes('{commune}') && t.includes('{date}')) return null
  return 'Le texte d’attestation doit contenir les variables {commune} et {date} (nécessaires pour afficher le nom de la commune et la date sur le certificat).'
}

export function defaultCertificateIssuerDetailsLines(
  mairie: { telephone?: string, email?: string } | null | undefined,
): string {
  const tel = mairie?.telephone?.trim() ?? ''
  const em = mairie?.email?.trim() ?? ''
  return [tel, em].filter(Boolean).join('\n')
}

export function issuerPdfLinesFromInputs(options: {
  nomCommune: string
  mairie: { telephone?: string, email?: string } | null | undefined
  issuerDetails?: string | null
  population?: number
}): string[] {
  const detailsRaw = options.issuerDetails?.replace(/\r\n/g, '\n').trim()
  if (detailsRaw) {
    return detailsRaw
      .split('\n')
      .slice(0, CERTIFICATE_ISSUER_DETAILS_MAX_INPUT_LINES)
      .filter(line => line.trim().length > 0)
  }
  const collectiviteLine = isVilleParPopulation(options.population)
    ? `Ville de ${options.nomCommune}`
    : `Commune de ${options.nomCommune}`
  const tel = options.mairie?.telephone?.trim() ?? ''
  const em = options.mairie?.email?.trim() ?? ''
  const lines: string[] = [collectiviteLine]
  if (tel) lines.push(tel)
  if (em) lines.push(em)
  return lines
}

export function issuerDetailsDefaultHintWithCommuneVillePrefix(
  hint: string | undefined,
  nomCommune: string | undefined,
  population: number | undefined,
): string | undefined {
  if (hint == null || !String(hint).trim()) return hint
  if (!nomCommune?.trim()) return hint
  if (typeof population !== 'number' || !Number.isFinite(population)) return hint
  const lines = hint.replace(/\r\n/g, '\n').split('\n')
  const prefix = isVilleParPopulation(population) ? 'Ville' : 'Commune'
  const first = `${prefix} de ${nomCommune.trim()}`
  const rest = lines.slice(1).join('\n').trimEnd()
  return rest.length > 0 ? `${first}\n${rest}` : first
}

export function withCertificateFieldDefaults(
  c: BANConfig,
  nomCommune: string | undefined,
  population?: number,
): BANConfig {
  if (!nomCommune?.trim()) return c
  const next = { ...c }
  if (!next.certificateAttestationText?.trim()) {
    next.certificateAttestationText = getDefaultAttestationTemplate(population)
  }
  return next
}

export const CERTIFICATE_PRESENTATION_NULL_PATCH_KEYS = [
  'certificateShowLogo',
  'certificateIssuerDetails',
  'certificateAttestationText',
] as const

/** Réinitialise la personnalisation certificat (null → suppression des clés côté API BAN au PATCH). */
export function resetCertificatePresentationToServiceDefaults(c: BANConfig): BANConfig {
  return {
    ...c,
    certificateShowLogo: null,
    certificateIssuerDetails: null,
    certificateAttestationText: null,
  }
}

export function normalizeCertificateAttestationTextInput(raw: string): string {
  const maxTotal = certificateAttestationEffectiveMaxChars()
  const lines = raw.replace(/\r\n/g, '\n').split('\n')
  const cappedLines = lines
    .slice(0, CERTIFICATE_ATTESTATION_MAX_INPUT_LINES)
    .map(line => line.slice(0, CERTIFICATE_ATTESTATION_MAX_RAW_CHARS_PER_LOGICAL_LINE))
  return cappedLines.join('\n').slice(0, maxTotal)
}

export function sanitizeCertificateAttestationText(raw: string): string {
  return normalizeCertificateAttestationTextInput(raw).trim()
}

export function normalizeCertificateIssuerDetailsInput(raw: string): string {
  const maxTotal = certificateIssuerDetailsEffectiveMaxChars()
  const lines = raw.replace(/\r\n/g, '\n').split('\n')
  const cappedLines = lines
    .slice(0, CERTIFICATE_ISSUER_DETAILS_MAX_INPUT_LINES)
    .map(line => line.slice(0, CERTIFICATE_ISSUER_DETAILS_MAX_CHARS_PER_LOGICAL_LINE))
  return cappedLines.join('\n').slice(0, maxTotal)
}

export function sanitizeCertificateIssuerDetails(raw: string): string {
  return normalizeCertificateIssuerDetailsInput(raw).trimEnd()
}

export function normalizedIssuerDetailsForPdf(config: {
  certificateIssuerDetails?: string | null
}): string | undefined {
  const detailsRaw = config.certificateIssuerDetails?.replace(/\r\n/g, '\n').trim()
  if (!detailsRaw) return undefined
  return normalizeCertificateIssuerDetailsInput(config.certificateIssuerDetails ?? '')
}

export function certificateIssuerBlockFingerprint(config: BANConfig): string {
  return JSON.stringify({
    certificateIssuerDetails: config.certificateIssuerDetails ?? null,
    certificateShowLogo: config.certificateShowLogo ?? null,
  })
}

/** Coupure des segments sans espace pour @react-pdf (U+200B). */
export const PDF_MAX_UNBROKEN_CHARS_PER_RUN = 44

export function insertSoftBreaksForPdfWrapping(
  text: string,
  maxRunLength: number = PDF_MAX_UNBROKEN_CHARS_PER_RUN,
): string {
  return text.replace(/[^\s]+/g, (run) => {
    if (run.length <= maxRunLength) return run
    const parts: string[] = []
    for (let i = 0; i < run.length; i += maxRunLength) {
      parts.push(run.slice(i, i + maxRunLength))
    }
    return parts.join('\u200B')
  })
}
