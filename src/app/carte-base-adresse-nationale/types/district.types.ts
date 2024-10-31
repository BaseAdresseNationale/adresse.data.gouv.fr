export interface DataDistrict {
  id: string
  type: string
  codeCommune: string
  banId: string
  nomCommune: string
  departement: {
    nom: string
    code: string
  }
  region: {
    nom: string
    code: string
  }
  codesPostaux: string[]
  population: number
  typeCommune: string
  nbNumeros: number
  nbNumerosCertifies: number
  nbVoies: number
  nbLieuxDits: number
  typeComposition: string
  displayBBox: number[]
  idRevision: string | null
  dateRevision: string | null
  voies: {
    id: string
    type: string
    banId: string
    idVoie: string
    nomVoie: string
    sourceNomVoie: string
    sources: string[]
    nbNumeros: number
    nbNumerosCertifies: number
  }[]
}
