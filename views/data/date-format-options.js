const TIME_ZONE = 'Europe/Paris'

const dateFormatOptions = {
  dateFormatOptionsLongDate: {
    timeZone: TIME_ZONE,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
  dateFormatOptionsDate: {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  },
  dateFormatOptionsTime: {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  },
}

export default dateFormatOptions
