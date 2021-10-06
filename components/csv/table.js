/* eslint react/no-array-index-key: off */
import PropTypes from 'prop-types'

function Table({headers, rows}) {
  return (
    <table>
      <tbody>
        <tr>
          {headers.map(header => <th key={header} className='header'>{header}</th>)}
        </tr>
        {rows.map((row, idx) => (
          <tr key={`row-${idx}`}>
            {row.map((item, index) => <th key={`row-${idx}-${index}`}>{item}</th>)}
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
}

Table.propTypes = {
  headers: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired
}

export default Table
