import React from 'react'
import PropTypes from 'prop-types'

import {Check} from 'react-feather'

const SourcesTable = ({data, cols, title, checkIsHighlighted, getId}) => {
  return (
    <div className='source-container'>
      <h3>{title}</h3>
      <tbody className='table-container'>
        <tr>
          <th />
          {Object.keys(cols).map(col => (
            <th key={cols[col].title}>{cols[col].title}</th>
          ))}
        </tr>
        {data.map(item => (
          <tr key={getId(item)}>
            {checkIsHighlighted(item) ? (
              <td className='highlighted centered'>
                <Check style={{verticalAlign: 'middle', margin: 'auto'}} />
              </td>) : (<td />)}

            {Object.keys(cols).map(col => (
              <td key={getId(col)} className={checkIsHighlighted(item) ? 'highlighted' : ''} >{cols[col].getValue(item)}</td>
            ))}
          </tr>
        ))}
      </tbody>
      <style jsx>{`
         h3 {
          margin-top: 1em;
          margin-bottom: 0;
        }

        th {
          background-color: #0053b3;
          color: #ffffff;
        }

        td, th {
          padding: .5em;
          border: .5px solid lightgrey;
        }

        .source-container {
          padding: 15px;
          width: 100%;
          margin-top: auto;
        }

        .table-container {
          width: 100%;
          display: inline-table;
          border: .5px solid lightgrey;
          margin-bottom: 1.5em;
        }

        .resume {
          padding: 1em;
        }

        .centered {
          text-align: center;
        }

        .highlighted {
          background-color: #d6f5d6;
        }

      `}</style>
    </div>
  )
}

SourcesTable.propTypes = {
  data: PropTypes.object.isRequired,
  cols: PropTypes.object.isRequired,
  title: PropTypes.string,
  checkIsHighlighted: PropTypes.func.isRequired,
  getId: PropTypes.func.isRequired
}

SourcesTable.defaultProps = {
  title: null
}

export default SourcesTable

