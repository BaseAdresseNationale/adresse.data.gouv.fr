import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../styles/theme'

const Table = ({csv}) => {
  if (!csv) {
    return null
  }

  const columns = csv.data[0]
  const ligns = csv.data.slice(1, 10)
  return (
    <div className='table'>
      {columns.map((col, idx) => {
        return (
          <div key={col}>
            <div className='title box' alt={col}>{col}</div>
            {ligns.map(lign => <div key={`${col} - ${lign}`} className='lign box'>{lign[idx]}</div>)}
          </div>
        )
      })}
      <style jsx>{`
        .table {
          display: flex;
          overflow-y: scroll;
          border: 1px ${theme.colors.lightGrey} solid;
        }

        .box {
          padding: 1em;
          margin-right: 0.3em;
          max-width: 120px;
          min-height: 80px;
          max-height: 80px;
          text-align: center;
          overflow: auto;
        }

        .box:hover {
          overflow: visible;
          background-color: ${theme.colors.darkGrey};
          max-width: none;
          max-height: none;
        }

        .title {
          background-color: ${theme.colors.lightGrey};
        }

        .lign {
        }
        `}</style>
    </div>
  )
}

Table.propTypes = {
  csv: PropTypes.object.isRequired
}

export default Table
