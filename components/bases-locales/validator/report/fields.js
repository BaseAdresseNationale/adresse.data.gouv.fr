import React from 'react'
import PropTypes from 'prop-types'

import KnownFields from './known-fields'
import UnknownFields from './unknown-fields'

function Fields({found, unknown, alias}) {
  return (
    <div className='fields-container'>
      <KnownFields found={found} alias={alias} />
      <UnknownFields fields={unknown} />
      <style jsx>{`
      .fields-container {
        display: grid;
        grid-template-columns: repeat(auto-fit,minmax(300px, 1fr));
        grid-gap: 2em 1em;
      }
      `}</style>
    </div>
  )
}

Fields.propTypes = {
  found: PropTypes.array,
  unknown: PropTypes.array,
  alias: PropTypes.object.isRequired
}

Fields.defaultProps = {
  found: [],
  unknown: []
}

export default Fields
