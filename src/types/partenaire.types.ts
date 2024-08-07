export enum PartenaireDeLaCharteServiceEnum {
  FORMATION = 'formation',
  ACCOMPAGNEMENT_TECNIQUE = 'accompagnement technique',
  REALISATION_DE_BASES_ADRESSES_LOCALES = 'réalisation de bases adresses locales',
  MISE_A_DISPOSITION_D_OUTILS_MUTUALISES = 'mise à disposition d\'outils mutualisés',
  PARTAGE_D_EXPERIENCE = 'partage d\'expérience',
}

export enum PartenaireDeLaCharteTypeEnum {
  COMMUNE = 'commune',
  ENTREPRISE = 'entreprise',
  ORGANISME = 'organisme',
}

export enum PartenaireDeLaCharteOrganismeTypeEnum {
  EPCI = 'epci',
  DEPARTEMENT = 'departement',
  REGION = 'region',
  AUTRE = 'autre',
}

export type CandidatePartenaireDeLaCharteType = {
  type: PartenaireDeLaCharteTypeEnum
  organismeType?: PartenaireDeLaCharteOrganismeTypeEnum
  name: string
  picture: string
  services: PartenaireDeLaCharteServiceEnum[]
  codeDepartement: string[]
  isPerimeterFrance?: boolean
  contactFirstName: string
  contactLastName: string
  contactEmail: string
  link?: string
  charteURL?: string
  codeRegion: string | null
  codeCommune: string | null
  testimonyURL?: string
  balURL?: string
  infos?: string
  perimeter?: string
}

export type PartenaireDeLaChartType = {
  _id: string
  _created: string
  _updated: string
  type: PartenaireDeLaCharteTypeEnum
  name: string
  picture: string
  contactFirstName: string
  contactLastName: string
  contactEmail: string
  services: PartenaireDeLaCharteServiceEnum[]
  codeDepartement: string[]
  link?: string
  charteURL?: string
  signatureDate?: string
  dataGouvOrganizationId?: string[]
  apiDepotClientId: string[]
}

export type PartenaireDeLaCharteCommuneType = PartenaireDeLaChartType & {
  type: PartenaireDeLaCharteTypeEnum.COMMUNE
  codeRegion: string
  codeCommune: string
  testimonyURL?: string
  balURL?: string
}

export type PartenaireDeLaCharteOrganismeType = PartenaireDeLaChartType & {
  type: PartenaireDeLaCharteTypeEnum.ORGANISME
  organismeType: PartenaireDeLaCharteOrganismeTypeEnum
  testimonyURL?: string
  infos?: string
  perimeter?: string
}

export type PartenaireDeLaCharteEntrepriseType = PartenaireDeLaChartType & {
  type: PartenaireDeLaCharteTypeEnum.ENTREPRISE
  isPerimeterFrance?: boolean
  infos?: string
  perimeter?: string
}
