import React from 'react'
import PropTypes from 'prop-types'
import {Check, X} from 'react-feather'

import theme from '@/styles/theme'

const CsvMeta = ({name, value, isValid}) => {
  return (
    <div>
      <div className='item'>
        <div><b>{name}</b></div>
        {isValid ? <div className='check'><Check /></div> : <div className='error'><X /></div>}
      </div>
      <div>{value}</div>
      <style jsx>{`
        .item {
          display: flex;
        }

        .check {
          margin-left: 1em;
          color: ${theme.colors.green};
        }

        .error {
          margin-left: 1em;
          color: ${theme.colors.red};
        }
        `}</style>
    </div>
  )
}

CsvMeta.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isValid: PropTypes.bool.isRequired
}

CsvMeta.defaultProps = {
  value: null
}

export default CsvMeta
