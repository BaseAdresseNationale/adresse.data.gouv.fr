import React from 'react'

import {Check} from 'react-feather'

const Sources = ({data, cols, title}) => {
  console.log(data)
  return (
    <div className='source-container'>
      <h3>{title}</h3>
      <tbody className='table-container'>
        <tr>
          <th />
          {Object.keys(cols).map(col => (
            <th>{cols[col].title}</th>
          ))}
        </tr>
        {data.map(item => (
          <tr>
            <td className='centered'>
              <Check style={{verticalAlign: 'middle', margin: 'auto'}} />
            </td>
            {Object.keys(cols).map(col => (
              <td>{cols[col].getValue(item)}</td>
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

export default Sources

