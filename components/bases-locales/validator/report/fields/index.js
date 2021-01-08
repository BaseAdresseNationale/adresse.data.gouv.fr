import React from 'react'
import PropTypes from 'prop-types'

import FoundFields from './found-fields'
import UnfoundFields from './unfound-fields'

function Fields({fields, notFound}) {
  return (
    <div className='fields-container'>
      {fields.length > 0 && <FoundFields fields={fields} />}
      {notFound.length > 0 && <UnfoundFields fields={notFound} />}
      <style jsx>{`
      .fields-container {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }
      `}</style>
    </div>
  )
}

Fields.propTypes = {
  fields: PropTypes.array,
  notFound: PropTypes.array
}

Fields.defaultProps = {
  fields: [],
  notFound: []
}

export default Fields
