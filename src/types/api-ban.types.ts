export type BANVoie = {
  id: string
  type: string
  banId: string | null
  idVoie: string
  nomVoie: string
  nomVoieAlt: Record<string, string>
  sourceNomVoie: string
  sources: string[]
  nbNumeros: number
  nbNumerosCertifies: number
}

export type BANCommune = {
  id: string
  type: string
  codeCommune: string
  banId: string | null
  nomCommune: string
  departement: { nom: string, code: string }
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
  voies: BANVoie[]
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
