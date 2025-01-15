import ResponsiveImage from '../ResponsiveImage'

const getSeason = () => {
  const ts = new Date().getTime()

  const MARCH_EQUINOX = new Date(new Date().getFullYear(), 2, 21).getTime()
  const JUNE_SOLSTICE = new Date(new Date().getFullYear(), 5, 21).getTime()
  const SEPTEMBER_EQUINOX = new Date(new Date().getFullYear(), 8, 21).getTime()
  const DECEMBER_SOLSTICE = new Date(new Date().getFullYear(), 11, 21).getTime()

  if (ts >= MARCH_EQUINOX && ts < JUNE_SOLSTICE) {
    return 'printemps'
  }
  if (ts >= JUNE_SOLSTICE && ts < SEPTEMBER_EQUINOX) {
    return 'ete'
  }
  if (ts >= SEPTEMBER_EQUINOX && ts < DECEMBER_SOLSTICE) {
    return 'automne'
  }

  return 'hiver'
}

export function SeasonSketch() {
  const curSeason = getSeason()

  return (
    <ResponsiveImage src={`/img/frise-des-saisons/${curSeason}.png`} alt={`Illustration ${curSeason}`} />
  )
}
