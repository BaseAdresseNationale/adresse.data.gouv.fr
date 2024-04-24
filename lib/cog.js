import {keyBy} from 'lodash'
import communes from '@etalab/decoupage-administratif/data/communes.json'

const communesActuelles = communes.filter(({type}) => type === 'commune-actuelle')
const communesIndex = keyBy(communesActuelles, 'code')

export function findCommuneName(codeCommune) {
  return communesIndex[codeCommune]?.nom || ''
}
