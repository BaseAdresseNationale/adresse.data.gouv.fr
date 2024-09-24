import { keyBy } from 'lodash'
import communes from '@etalab/decoupage-administratif/data/communes.json'

type CogCommune = {
  code: string
  nom: string
  type: string
  typeLiaison: number
  zone: string
  arrondissement: string
  departement: string
  region: string
  rangChefLieu: number
  siren: string
  codesPostaux: string[]
  population: number
}

const communesActuelles = (communes as CogCommune[]).filter(({ type }: CogCommune) => type === 'commune-actuelle')
const communesIndex = keyBy(communesActuelles, 'code')

export function findCommuneName(codeCommune: string) {
  return communesIndex[codeCommune]?.nom || ''
}
