require('dotenv').config()
const updatedDateUrl = process.env.NEXT_LAST_UPDATED_DATE_ADDOCK_URL
export const fetchLastUpdatedDate = async () => {
  try {
    const res = await fetch(updatedDateUrl)
    const text = await res.text()
    const match = text.match(/gra-geocode-compute-1 = (.+)/)
    if (!match) {
      return null
    }

    const [, dateString] = match
    const date = new Date(dateString.trim())

    const formattedDate = `${date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })}`

    return formattedDate
  } catch (error) {
    console.error('Erreur lors de la récupération de la date :', error)
    return null
  }
}
