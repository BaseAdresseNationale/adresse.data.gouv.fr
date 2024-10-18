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
  _id: string
  startedAt: string
  finishedAt: string
  status: HarvestStatus
  error: string
  updateStatus: UpdateStatusEnum
  updateRejectionReason: string
  fileId: string
}

export type SourceMoissoneurType = {
  _id: string
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
  _updated: string
  _created: string
  _deleted: boolean
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
  _id: string
  sourceId: string
  codeCommune: string
  harvestId: string
  updateStatus: UpdateStatusEnum
  updateRejectionReason?: string | undefined
  fileId?: string
  dataHash?: string
  nbRows?: number
  nbRowsWithErrors?: number
  uniqueErrors?: string[]
  publication?: PublicationMoissoneurType
  current?: boolean
  _created: string
}

export interface OrganizationMoissoneurType {
  _id: string
  name?: string
  page?: string
  logo?: string
  perimeters?: PerimeterType[]
  _updated?: Date
  _created?: Date
  _deleted?: boolean
}

export interface OrganizationBalAdminType extends OrganizationMoissoneurType {
  partenaire?: PartenaireDeLaChartType
}
