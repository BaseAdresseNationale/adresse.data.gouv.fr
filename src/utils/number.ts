export function numFormater(num: number, lang = 'fr-FR') {
  if (num.toString().length > 5) {
    const formatedNumber = (Math.round(num / 10000) / 100)
    return `${new Intl.NumberFormat(lang).format(formatedNumber)} million${formatedNumber > 1.99 ? 's' : ''}`
  }

  return new Intl.NumberFormat(lang).format(num)
}
