import {sortBy} from 'lodash'

const SOURCES_MAPPING = {
  bal: 'commune',
  'ign-api-gestion-municipal_administration': 'commune',
  'ign-api-gestion-laposte': 'laposte',
  'ign-api-gestion-sdis': 'sdis',
  'ign-api-gestion-ign': 'inconnue',
  'ban-v0': 'inconnue',
  cadastre: 'cadastre',
  ftth: 'arcep',
  'insee-ril': 'insee'
}

const types = [
  {name: 'commune', background: '#f47733', color: 'black', priority: 0},
  {name: 'insee', background: '#cf6783', color: 'white', priority: 1},
  {name: 'sdis', background: '#418864', color: 'white', priority: 2},
  {name: 'laposte', background: '#f6d611', color: 'back', priority: 2},
  {name: 'cadastre', background: '#8C5FF5', color: 'white', priority: 3},
  {name: 'arcep', background: '#0c4cb2', color: 'white', priority: 4},
  {name: 'habitation', background: '#21BA45', color: 'white', priority: 5},
  {name: 'commerce', background: '#53DD9E', color: 'black', priority: 6},
  {name: 'tourisme', background: '#A1003C', color: 'white', priority: 7},
  {name: 'industrie', background: '#a5673f', color: 'white', priority: 8},
  {name: 'chantier', background: '#00B5AD', color: 'white', priority: 9},
  {name: 'dépendance', background: '#FBBD08', color: 'black', priority: 10},
  {name: 'équipement', background: '#F2711C', color: 'white', priority: 11},
  {name: 'toponyme', background: '#1E90DA', color: 'white', priority: 12},
  {name: 'inconnue', background: '#DDDDDD', color: 'black', priority: 13}
]

export function getType(name) {
  const _name = SOURCES_MAPPING[name] || name
  return types.find(type => type.name === _name) || {
    _name,
    background: '#53657D',
    color: 'white',
    priority: types.length + 1
  }
}

export function getTypeByPriority(items) {
  return sortBy(items, item => {
    const type = getType(item)
    return type.priority
  })
}

export function unionTypes(arrays) {
  const union = []
  arrays.map(array => {
    return array && array.map(item => {
      if (!union.includes(item)) {
        union.push(item)
      }

      return false
    })
  })

  return union
}

export default types
