import FaClose from 'react-icons/lib/fa/close'

import Tag from '../components/explorer/tag'

export function getPosition(position) {
  if (position) {
    return `${position.coordinates[0]}, ${position.coordinates[1]}`
  }

  return <FaClose />
}

export function tagsList(items) {
  return (
    <div style={{display: 'flex', flexWrap: 'wrap'}}>
      {items.map(item => <Tag key={item} type={item} />)}
    </div>
  )
}
