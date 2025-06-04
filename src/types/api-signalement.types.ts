export type PaginatedSignalements = {
  // TODO : define the type signalement
  data: any[]
  page: number
  total: number
  limit: number
}

export enum SignalementStatusEnum {
  PENDING = 'PENDING',
  IGNORED = 'IGNORED',
  PROCESSED = 'PROCESSED',
  EXPIRED = 'EXPIRED',
}

export enum SignalementTypeEnum {
  LOCATION_TO_CREATE = 'LOCATION_TO_CREATE',
  LOCATION_TO_DELETE = 'LOCATION_TO_DELETE',
  LOCATION_TO_UPDATE = 'LOCATION_TO_UPDATE',
}

export type SignalementCommuneStatus = {
  disabled: boolean
  message?: string
}
