import FaClose from 'react-icons/lib/fa/close'

export function getPosition(position) {
  if (position) {
    return `${position.coordinates[0]}, ${position.coordinates[1]}`
  }

  return <FaClose />
}

export function list(sources) {
  return sources.map((source, idx) =>
  `${source}${idx + 1 < sources.length ? ', ' : ''}`)
}
