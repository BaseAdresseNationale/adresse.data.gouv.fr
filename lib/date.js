import {orderBy} from 'lodash'

export function sortEventsByDate(events, order) {
  return orderBy(events, [
    function (event) {
      return Date.parse(`${event.date}T${event.startHour}`)
    },
  ], [order])
}

export function sanitizedDate(date) {
  return new Date(date).toLocaleDateString('fr-FR')
}

export function dateWithDay(date) {
  const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}

  return new Date(date).toLocaleDateString('fr-FR', options)
}

export function sanitizedDateTime(date) {
  const newDate = new Date(date)

  return `le ${newDate.toLocaleDateString('fr-FR')} à ${newDate.getHours()}h${newDate.getMinutes().toString().padStart(2, '0')}`
}

export function accessibleDateTime(date) {
  const newDate = new Date(date)
  const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}

  return `le ${newDate.toLocaleDateString('fr-FR', options)} à ${newDate.getHours()} heures ${newDate.getMinutes().toString().padStart(2, '0')}`
}
