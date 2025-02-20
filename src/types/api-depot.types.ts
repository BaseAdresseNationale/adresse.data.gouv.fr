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

export enum ClientApiDepotAuthorizationStrategyEnum {
  HABILITATION = 'habilitation',
  CHEF_DE_FILE = 'chef-de-file',
  INTERNAL = 'internal',
}

export type ClientApiDepotType = {
  id: string
  createdAt: string
  updatedAt: string
  active: boolean
  authorizationStrategy: ClientApiDepotAuthorizationStrategyEnum
  mandataire: string
  nom: string
  chefDeFileId: string
  options: {
    relaxMode: boolean
  }
}

export type ChefDeFileApiDepotType = {
  id: string
  nom?: string
  email?: string
  perimeters?: PerimeterType[]
  signataireCharte?: boolean
  isEmailPublic?: boolean
  createdAt?: string
  updatedAt?: string
}

export type ClientApiDepotWithChefDeFileType = ClientApiDepotType & {
  chefDeFile: ChefDeFileApiDepotType
}

export type ClientsWithChefDeFileAndRevisions = ClientApiDepotWithChefDeFileType & {
  revisions: Pick<Revision, 'id' | 'codeCommune' | 'status' | 'isCurrent' | 'publishedAt' | 'validation'>[]
}
