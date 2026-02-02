export enum CertificateTypeEnum {
  DISTRICT = 'DISTRICT',
  ALL = 'ALL',
  DISABLED = 'DISABLED',
}

export const CertificateTypeLabel: Record<CertificateTypeEnum, string> = {
  [CertificateTypeEnum.DISTRICT]: 'Téléchargement réservé à la Mairie',
  [CertificateTypeEnum.ALL]: 'Téléchargement accessible à tous',
  [CertificateTypeEnum.DISABLED]: 'Désactivé',
}

export type BANAddress = {
  id: string
  type: string
  banId: string | null
  numero: string
  repetition: string
  nomVoie: string
  sourceNomVoie: string
  codeCommune: string
  nomCommune: string
  codePostal: string
  sourcePosition: string
  position: { type: string, coordinates: number[] }
  sources: string[]
  displayBBox: [number, number, number, number]
}

export type BANVoie = {
  id: string
  type: string
  banId: string | null
  idVoie: string
  nomVoie: string
  nomVoieAlt: Record<string, string>
  libelleVoieComplet: string
  natureVoie?: string
  voiePrivee?: boolean
  sourceNomVoie: string
  sources: string[]
  nbNumeros: number
  nbNumerosCertifies: number
  dateAjout: string
  dateAnnulation?: string
  typeVoie?: string
  codeRivoli?: string
}

export type BANConfig = {
  certificate: CertificateTypeEnum
  // Additional properties can be added as needed
  mandatary?: string
  defaultLanguage?: string
  autoFixLabels?: boolean
  computOldDistrict?: boolean
  computInteropKey?: boolean
}

export type BANCommune = {
  id: string
  type: string
  codeCommune: string
  banId: string | null
  nomCommune: string
  departement: { nom: string, code: string }
  codeDepartement: string
  region: { nom: string, code: string }
  codesPostaux: string[]
  population: number
  typeCommune: string
  nbNumeros: number
  nbNumerosCertifies: number
  nbVoies: number
  nbLieuxDits: number
  typeComposition: string
  displayBBox: number[]
  idRevision: string
  dateRevision: string
  dateAnnulation: string
  voies: BANVoie[]
  config: BANConfig
  withBanId?: boolean
}

export type BANStats = {
  total: {
    population: number
    nbCommunes: number
  }
  france: {
    population: number
    nbCommunes: number
  }
  ban: {
    nbAdresses: number
    nbAdressesCertifiees: number
    nbCommunesCouvertes: number
    populationCouverte: number
    nbCommunesIdSocle: number
    nbAdressesIdSocle: number
    _id: string
    nbAdressesAvecBanId: number
    nbCommunesAvecBanId: number
  }
  bal: {
    nbAdresses: number
    nbAdressesCertifiees: number
    nbCommunesCouvertes: number
    populationCouverte: number
    nbCommunesIdSocle: number
    nbAdressesIdSocle: number
    _id: string
    nbAdressesAvecBanId: number
    nbCommunesAvecBanId: number
  }
  assemblage: {
    nbAdresses: number
    nbAdressesCertifiees: number
    nbCommunesCouvertes: number
    populationCouverte: number
    nbCommunesIdSocle: number
    nbAdressesIdSocle: number
    _id: string
    nbAdressesAvecBanId: number
    nbCommunesAvecBanId: number
  }
}
