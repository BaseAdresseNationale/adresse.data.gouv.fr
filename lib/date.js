import {orderBy} from 'lodash'

export function sortEventsByDate(events, order) {
  return orderBy(events, [
    function (event) {
      return Date.parse(`${event.date}T${event.startHour}`)
    },
  ], [order])
}
