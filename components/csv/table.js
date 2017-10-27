import React from 'react'
import PropTypes from 'prop-types'

const Table2 = ({headers, rows}) => {
  return (
    <table>
      <tr>
        {headers.map(header => <th key={header}>{header}</th>)}
      </tr>
      {rows.map((row, idx) => (
        <tr key={`col-${idx}`}>
          {row.map((item, index) => <th key={`$col-${idx}-${index}`}>{item}</th>)}
        </tr>
      ))}
      <style jsx>{`
          table, th, td {
            border: 1px solid whitesmoke;
            overflow: scroll;
          }

          th {
            padding: 1em;
          }
          `}</style>
    </table>
  )
}

Table2.propTypes = {
  headers: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired
}

export default Table2
