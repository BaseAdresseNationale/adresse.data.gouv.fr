import { toast } from 'react-toastify'

export function formatCoords(coords: [number, number]): string {
  const [lon, lat] = coords
  const formattedLon = Math.abs(lon).toFixed(6)
  const formattedLat = Math.abs(lat).toFixed(6)
  const lonDirection = lon >= 0 ? 'E' : 'W'
  const latDirection = lat >= 0 ? 'N' : 'S'
  return `${formattedLat}° ${latDirection}, ${formattedLon}° ${lonDirection}`
}

export function copyCoordsToClipboard(coords: [number, number]) {
  const [lon, lat] = coords
  const coordsString = `${lat.toFixed(6)},${lon.toFixed(6)}`
  navigator?.clipboard.writeText(coordsString)
  toast(`Position GPS copiée dans le presse-papier (${coordsString})`)
}

const toFixedGPS = (gps: number) => gps.toFixed(6)
export const getLinkFromCoords = (coords: [number, number]) => `geo:${toFixedGPS(coords[1])},${toFixedGPS(coords[0])}`
