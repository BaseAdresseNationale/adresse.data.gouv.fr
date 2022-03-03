export const formatTag = tag => {
  const cleanTag = tag.trim().replace(/([^ \na-z\dÀ-ÖØ-öø-ÿ/]|\s+)+/gi, ' ')

  if (cleanTag) {
    return `#${cleanTag.split(' ').map(word =>
      word[0].toUpperCase() + word.slice(1, word.length)
    ).join('')}`
  }
}
