import {sortBy} from 'lodash'

const types = [
  {name: 'ban', background: '#FFDF51', color: 'black', priority: 0},
  {name: 'bano', background: '#418864', color: 'white', priority: 1},
  {name: 'cadastre', background: '#8C5FF5', color: 'white', priority: 2},
  {name: 'habitation', background: '#21BA45', color: 'white', priority: 3},
  {name: 'commerce', background: '#53DD9E', color: 'black', priority: 4},
  {name: 'tourisme', background: '#A1003C', color: 'white', priority: 5},
  {name: 'industrie', background: '#a5673f', color: 'white', priority: 6},
  {name: 'chantier', background: '#00B5AD', color: 'white', priority: 7},
  {name: 'dépendance', background: '#FBBD08', color: 'black', priority: 8},
  {name: 'équipement', background: '#F2711C', color: 'white', priority: 9},
  {name: 'toponyme', background: '#1E90DA', color: 'white', priority: 10},
  {name: 'inconnue', background: '#DDDDDD', color: 'black', priority: 11}
]

export function getType(name) {
  return types.find(type => type.name === name) || {
    name,
    background: '#53657D',
    color: 'white',
    priority: types.length + 1
  }
}

export function getTypeByPriority(items) {
  return sortBy(items, item => types.find(t => t.name === item).priority)
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
