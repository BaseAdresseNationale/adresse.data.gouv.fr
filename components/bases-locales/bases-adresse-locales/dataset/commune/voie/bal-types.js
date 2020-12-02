import React from 'react'
import PropTypes from 'prop-types'
import {tagsList} from '@/lib/table'

import Tag from '@/components/tag'

function BalTypes({positions}) {
  const checkTypes = Object.prototype.hasOwnProperty.call(positions[0], 'type')

  if (checkTypes) {
    const types = positions.map(position => position.type)
    return (
      <>
        {tagsList(types)}
      </>
    )
  }

  return (
    <div style={{display: 'flex', flexWrap: 'wrap'}}>
      <Tag type='Non renseigné' />
    </div>
  )
}

BalTypes.propTypes = {
  positions: PropTypes.array.isRequired
}

export default BalTypes
