type TypePosition = {
  type: string
  coordinates: [number, number] | [number, number, number]
}

export type TypeItem = 'commune' | 'voie' | 'lieu-dit'

type TypeSourceAddress = Record<string, unknown>

export interface TypeMicroToponymPartial {
  id: string
  idVoie: string
  nomVoie: string
  nomVoieAlt?: Record<string, string>
}

export interface TypeMicroToponym extends TypeMicroToponymPartial {
  banId?: string
  sourceNomVoie: string
  sources: string[]
  nbNumeros: number
  nbNumerosCertifies: number
}

export interface TypeMicroToponymExtended extends TypeMicroToponym {
  type: TypeItem
  displayBBox: [number, number, number, number]
  position: TypePosition
  commune: TypeDistrict
  numeros: TypeAddress[]
}

export interface TypeDistrictPartial {
  banId?: string
  id: string
  departement: {
    nom: string
    code: string
  }
  region: {
    nom: string
    code: string
  }
}

export interface TypeDistrict extends TypeDistrictPartial {
  nom: string
  code: string
}

export interface TypeDistrictConfig {
  certificate?: {}
}

export interface TypeDistrictExtended extends TypeDistrictPartial {
  type: TypeItem
  codeCommune: string
  nomCommune: string
  codesPostaux: string[]
  population: number
  typeCommune: string
  nbNumeros: number
  nbNumerosCertifies: number
  nbVoies: number
  nbLieuxDits: number
  typeComposition: string
  displayBBox: [number, number, number, number]
  idRevision?: string | null
  dateRevision?: string | null
  voies: TypeMicroToponym[]
  config?: TypeDistrictConfig
}

export interface TypeAddress {
  banId?: string
  id: string
  idVoie?: string
  numero: number
  suffixe?: string | null
  nomVoie?: string
  nomVoieAlt?: string
  lieuDitComplementNom?: string | null
  parcelles: any[]
  sources: string[]
  certifie: boolean
  position: TypePosition
  positionType: string
  sourcePosition: string
  codePostal: string
  libelleAcheminement: string
  dateMAJ: string
}

export interface TypeAddressExtended {
  type: TypeItem
  banId?: string
  banIdMainCommonToponym?: string
  banIdDistrict?: string
  dateMAJ: string
  numero: number
  suffixe: string | null
  lieuDitComplementNom?: string | null
  parcelles: string[]
  sources: string[]
  certifie: boolean
  position: TypePosition
  positionType: string
  positions: {
    position: TypePosition
    positionType: string
  }[]
  displayBBox: [number, number, number, number]
  sourcePosition: string
  lon: number
  lat: number
  x: number
  y: number
  tiles: string[]
  codeAncienneCommune?: string | null
  nomAncienneCommune?: string | null
  codePostal: string
  libelleAcheminement: string
  adressesOriginales: TypeSourceAddress[]
  id: string
  cleInterop: string
  voie: TypeMicroToponymPartial
  commune: TypeDistrict
  withBanId: boolean
  config?: {
    certificate: {}
  }
}
