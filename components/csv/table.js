import React from 'react'
import PropTypes from 'prop-types'

const Table2 = ({headers, rows}) => (
  <table>
    <tbody>
      <tr>
        {headers.map(header => <th key={header} className='header'>{header}</th>)}
      </tr>
      {rows.map((row, idx) => (
        <tr key={`col-${idx}`}>
          {row.map((item, index) => <th key={`$col-${idx}-${index}`}>{item}</th>)}
        </tr>
      ))}
    </tbody>
    <style jsx>{`
        table {
          display: block;
          overflow: scroll;
        }

        table, th, td {
          border: 1px solid whitesmoke;
          font-weight: 400;
        }

        th {
          padding: 1em;
        }

        .header {
          font-weight: 700;
        }
        `}</style>
  </table>
)

Table2.propTypes = {
  headers: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired
}

export default Table2
