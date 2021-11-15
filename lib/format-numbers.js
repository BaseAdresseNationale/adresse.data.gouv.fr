const MAX_SAFE_INTEGER = 9007199254740991

export function formatInteger(number) {
  const absoluteValue = Math.abs(number)

  if (absoluteValue > MAX_SAFE_INTEGER) {
    throw new Error('Integer is out of bounds')
  }

  if (absoluteValue < 10000) {
    return absoluteValue.toString()
  }

  const chars = String(absoluteValue).split('')
  const uncompleteGroupSize = chars.length % 3
  const numberCompleteGroups = (chars.length - uncompleteGroupSize) / 3
  const groups = []

  if (uncompleteGroupSize > 0) {
    groups.push(chars.slice(0, uncompleteGroupSize).join(''))
  }

  let i = 0
  while (i < numberCompleteGroups) {
    const from = uncompleteGroupSize + (i * 3)
    const to = from + 3
    const group = chars.slice(from, to).join('')

    groups.push(group)
    i++
  }

  return groups.join(' ')
}

export function formatPercent(percent) {
  if (Number(percent) === percent && percent % 1 !== 0) {
    const fixed = Number.parseFloat(percent).toFixed(2)
    return String(fixed).replace('.', ',')
  }

  return percent
}

export function spaceThousands(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function numFormater(num) {
  if (num.toString().length > 5) {
    const formatedNumber = (Math.round(num / 10000) / 100)
    return `${new Intl.NumberFormat().format(formatedNumber)} million${formatedNumber > 1.99 ? 's' : ''}`
  }

  return new Intl.NumberFormat().format(num)
}
