import {sortBy} from 'lodash'

const types = [
  {name: 'ban', background: '#FFDF51', color: 'black', priority: 0},
  {name: 'bano', background: '#418864', color: 'white', priority: 1},
  {name: 'cadastre', background: '#8C5FF5', color: 'white', priority: 2},
  {name: 'habitation', background: '#21BA45', color: 'white', priority: 3},
  {name: 'commerce', background: '#53DD9E', color: 'black', priority: 4},
  {name: 'site-touristique', background: '#A1003C', color: 'white', priority: 5},
  {name: 'site-industriel', background: '#a5673f', color: 'white', priority: 6},
  {name: 'dependance-batie-isolee', background: '#FBBD08', color: 'black', priority: 7},
  {name: 'installations-techniques', background: '#F2711C', color: 'white', priority: 8},
  {name: 'local-commun', background: '#00B5AD', color: 'white', priority: 9},
  {name: 'divers', background: '#DDDDDD', color: 'black', priority: 10}
]

export function getTypeByPriority(items) {
  return sortBy(items, item => types.find(t => t.name === item).priority)
}

export function unionTypes(arrays) {
  const union = []
  arrays.map(array => {
    return array.map(item => {
      if (!union.includes(item)) {
        union.push(item)
      }
      return false
    })
  })

  return union
}

export default types
