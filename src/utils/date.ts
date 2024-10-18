import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

export const getFullDate = (date: Date) => {
  return `${daysOfWeek[date.getDay()]} ${date.getDate()} ${date.toLocaleDateString('fr-FR', { month: 'long' })} ${date.getFullYear()}`
}

export function formatDate(string: string, pattern = 'PPPpp') {
  return format(new Date(string), pattern, { locale: fr })
}
