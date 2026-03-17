import { PerimeterType } from './api-depot.types'

export enum ClientTypeEnum {
  API_DEPOT = 'api-depot',
  MOISSONNEUR_BAL = 'moissonneur-bal',
}

export type ClientType = {
  id?: string
  name: string
  clientId: string
  partenaireId: string
  type: ClientTypeEnum
  perimeters?: PerimeterType[]
  createdAt?: Date
  updatedAt?: Date
  deletedAt: Date
}

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
  name: string
  siret: string
  picture?: string
  contactLastName: string
  contactFirstName: string
  contactEmail: string
  type: PartenaireDeLaCharteTypeEnum
  services: PartenaireDeLaCharteServiceEnum[]
  webSiteURL: string
  coverDepartement: string[]
  charteURL: string
  charteSignatureDate?: Date
  createdAt?: string
  updatedAt?: string
  deletedAt?: Date

  entrepriseIsPerimeterFrance: boolean
  communeCodeInsee: string
  communeBalURL: string
  organismeType: PartenaireDeLaCharteOrganismeTypeEnum
  organismeInfo: string
}

export type PartenaireDeLaChartType = {
  id: string
  name: string
  siret: string
  picture: string
  contactLastName: string
  contactFirstName: string
  contactEmail: string
  type: PartenaireDeLaCharteTypeEnum
  services: PartenaireDeLaCharteServiceEnum[]
  webSiteURL: string
  coverDepartement: string[]
  charteURL: string
  charteSignatureDate: Date
  clients: ClientType[]
  createdAt: string
  updatedAt: string
  deletedAt: Date

  entrepriseReviews?: ReviewType[]
  communeCodeInsee: string
  organismeInfo: string
}

export type PartenaireDeLaCharteCommuneType = PartenaireDeLaChartType & {
  type: PartenaireDeLaCharteTypeEnum.COMMUNE
  communeBalURL: string
}

export type PartenaireDeLaCharteOrganismeType = PartenaireDeLaChartType & {
  type: PartenaireDeLaCharteTypeEnum.ORGANISME
  organismeType: PartenaireDeLaCharteOrganismeTypeEnum
}

export type PartenaireDeLaCharteEntrepriseType = PartenaireDeLaChartType & {
  type: PartenaireDeLaCharteTypeEnum.ENTREPRISE
  entrepriseIsPerimeterFrance: boolean
}

export type ReviewType = {
  id: string
  email: string
  isAnonymous?: boolean
  community: string
  rating: number
  comment: string
  reply?: string
  createdAt: string
  updatedAt: string
}

export type ReviewFormType = Omit<ReviewType, 'id' | 'createdAt' | 'updatedAt'>
