import {deburr} from 'lodash'

export function byTags(tags, tagsToContain) {
  return tagsToContain.map(tag => tags.includes(tag))
    .every(i => i === true)
}

export function byText(text, toFind) {
  const formatText = text => deburr(text).toUpperCase()
  return formatText(text).includes(formatText(toFind))
}

export default {
  byTags,
  byText
}
