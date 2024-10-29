import { PerimeterType } from './api-depot.types'
import { PartenaireDeLaChartType } from './partenaire.types'

export type PageHarvests = {
  offset: number
  limit: number
  count: number
  results: HarvestMoissonneurType[]
}

export enum RevisionStatusMoissoneurEnum {
  PROVIDED_BY_OTHER_CLIENT = 'provided-by-other-client',
  PROVIDED_BY_OTHER_SOURCE = 'provided-by-other-source',
  NOT_CONFIGURED = 'not-configured',
  PUBLISHED = 'published',
  ERROR = 'error',
}

export enum UpdateStatusEnum {
  UNCHANGED = 'unchanged',
  REJECTED = 'rejected',
  UPDATED = 'updated',
}

export enum HarvestStatus {
  FAILED = 'failed',
  COMPLETED = 'completed',
  ACTIVE = 'active',
}

export type HarvestMoissonneurType = {
  id: string
  startedAt: string
  finishedAt: string
  status: HarvestStatus
  error: string
  updateStatus: UpdateStatusEnum
  updateRejectionReason: string
  fileId: string
}

export type SourceMoissoneurType = {
  id: string
  url: string
  title: string
  page: string
  organizationId: string
  license: string
  enabled: boolean
  description: string
  harvesting: {
    lastHarvest: Date
    harvestingSince: Date | null
  }
  updatedAt: string
  createdAt: string
  deletedAt: boolean
}

export interface ExtendedSourceMoissoneurType extends SourceMoissoneurType {
  harvestError?: boolean
  nbRevisionError?: number
}

export type PublicationMoissoneurType = {
  status: RevisionStatusMoissoneurEnum
  publishedRevisionId?: string | undefined
  errorMessage?: string
  currentClientId?: string
  currentSourceId?: string
}

export type RevisionMoissoneurType = {
  id: string
  sourceId: string
  codeCommune: string
  harvestId: string
  updateStatus: UpdateStatusEnum
  updateRejectionReason?: string | undefined
  fileId?: string
  dataHash?: string
  publication?: PublicationMoissoneurType
  current?: boolean
  createdAt: string
  validation: {
    nbRows?: number
    nbRowsWithErrors?: number
    uniqueErrors?: string[]
  }
}

export interface OrganizationMoissoneurType {
  id: string
  name?: string
  page?: string
  logo?: string
  perimeters?: PerimeterType[]
  updatedAt?: Date
  createdAt?: Date
  deletedAt?: boolean
}

export interface OrganizationBalAdminType extends OrganizationMoissoneurType {
  partenaire?: PartenaireDeLaChartType
}
