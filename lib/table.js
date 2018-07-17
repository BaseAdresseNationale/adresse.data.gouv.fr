import React from 'react'

// TODO: Make this a real component

/* eslint import/prefer-default-export: off */
import Tag from '../components/tag'

export function tagsList(items) {
  return (
    <div style={{display: 'flex', flexWrap: 'wrap'}}>
      {items.map(item => <Tag key={item} type={item} />)}
    </div>
  )
}
