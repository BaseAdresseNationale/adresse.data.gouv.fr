import {deburr} from 'lodash'

export function byProps(item, propsToContain) {
  return Object.keys(propsToContain).map(prop => {
    if (propsToContain[prop] && propsToContain[prop].length > 0) {
      if (item[prop].length === propsToContain[prop].length) {
        return item[prop].every(v => propsToContain[prop].includes(v))
      }

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
