export enum BaseAdresseLocaleStatus {
  PUBLISHED = 'published',
  REPLACED = 'replaced',
  DRAFT = 'draft',
  DEMO = 'demo',
}

export enum BaseAdresseLocaleSyncStatus {
  SYNCED = 'synced',
  OUTDATED = 'outdated',
  CONFLICT = 'conflict',
}

export type BaseLocaleSync = {
  status: BaseAdresseLocaleSyncStatus
  isPaused: boolean
  lastUploadedRevisionId: string
  currentUpdated: string
}

export type BaseAdresseLocale = {
  id: string
  banId: string
  createdAt: string
  updatedAt: string
  deletedAt: string
  nom: string
  commune: string
  emails: string[]
  status: BaseAdresseLocaleStatus
  sync: BaseLocaleSync
}
