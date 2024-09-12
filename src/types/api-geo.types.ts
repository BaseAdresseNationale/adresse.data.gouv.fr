export type Departement = {
  code: string
  nom: string
  codeRegion: string
}

export type Commune = {
  nom: string
  code: string
  codesPostaux: string[]
  siren: string
  codeEpci: string
  codeDepartement: string
  codeRegion: string
  population: number
}

export type EPCI = {
  nom: string
  code: string
  codeDepartement: string
  codeRegion: string
  population: number
  centre?: {
    type: string
    coordinates: number[]
  }
  contour?: {
    type: string
    coordinates: number[][][]
  }
}
