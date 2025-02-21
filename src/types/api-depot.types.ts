export type Revision = {
  id: string
  codeCommune: string
  client: {
    id: string
    nom: string
    mandataire: string
  }
  status: string
  isReady: any
  validation: {
    valid: boolean
    validatorVersion: string
    errors: any[]
    warnings: any[]
    infos: any[]
    rowsCount: number
  }
  context: {
    extras: any
  }
  publishedAt: string
  createdAt: string
  updatedAt: string
  isCurrent: boolean
  habilitation: {
    id: string
    codeCommune: string
    emailCommune: string
    strategy: any
    createdAt: string
    updatedAt: string
    expiresAt: string
  }
}

export enum HabilitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export type Habilitation = {
  id: string
  codeCommune: string
  emailCommune: string
  franceconnectAuthenticationUrl: string
  strategy: any
  client: string
  status: HabilitationStatus
  createdAt: string
  updatedAt: string
  expiresAt: string
}

export enum TypePerimeterEnum {
  EPCI = 'epci',
  DEPARTEMENT = 'departement',
  COMMUNE = 'commune',
}

export type PerimeterType = {
  type: TypePerimeterEnum
  code: string
}
