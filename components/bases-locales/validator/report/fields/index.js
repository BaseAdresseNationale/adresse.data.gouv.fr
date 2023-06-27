import PropTypes from 'prop-types'

import FoundFields from './found-fields'
import UnfoundFields from './unfound-fields'

function Fields({fields, notFound}) {
  return (
    <div className='fields-container'>
      {notFound.length > 0 && <UnfoundFields fields={notFound} />}
      {fields.length > 0 && <FoundFields fields={fields} />}

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
  fields: PropTypes.array.isRequired,
  notFound: PropTypes.array.isRequired
}

export default Fields
