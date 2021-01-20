import React from 'react'
import PropTypes from 'prop-types'
import {Check, X} from 'react-feather'

import theme from '@/styles/theme'

function CsvMeta({name, value, isValid}) {
  return (
    <div>
      <div className='item'>
        <div><b>{name}</b></div>
        {isValid ? <div className='check'><Check /></div> : <div className='error'><X /></div>}
      </div>
      <div className='item-value'>{value}</div>
      <style jsx>{`
        .item {
          display: flex;
          justify-content: center;
        }

        .check {
          margin-left: 1em;
          color: ${theme.colors.green};
        }

        .item-value {
          text-align: center;
          font-weight: 600;
          border-radius: 4px;
          font-size: medium;
          background-color: whitesmoke;
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
