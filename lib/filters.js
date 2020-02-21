import {deburr} from 'lodash'

export function byProps(item, propsToContain) {
  return Object.keys(propsToContain).map(prop => {
    if (propsToContain[prop] && propsToContain[prop].length > 0) {
      return propsToContain[prop].includes(item[prop])
    }

    return true
  }).every(i => i === true)
}

export function byText(text, toFind) {
  const formatText = text => deburr(text).toUpperCase()
  return formatText(text).includes(formatText(toFind))
}

export default {
  byProps,
  byText
}
