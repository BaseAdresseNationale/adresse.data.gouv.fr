import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../styles/theme'

import LineValue from './line-value'

const Line = ({line, unknownFields, onHover}) => {
  return (
    <div className='container'>
      <table>
        <thead>
          <tr>
            {Object.keys(line).map(key => !key.startsWith('_') && <th key={`th-${key}`}>{key}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.keys(line).map(key => !key.startsWith('_') &&
              <LineValue
                key={`td-${key}`}
                value={line[key]}
                unknownField={unknownFields.includes(key)}
                handleHover={onHover}
              />
            )}
          </tr>
        </tbody>
      </table>
      <style jsx>{`
        .container {
          margin: 1em 0;
          overflow-x:auto;
        }

        table {
            border-collapse: collapse;
            border-spacing: 0;
            width: 100%;
            border: 1px solid #ddd;
        }

        th {
          padding: 0.5em;
        }

        tr:nth-child(2n) {
          background-color: ${theme.backgroundGrey};
        }
        `}</style>
    </div>
  )
}

Line.propTypes = {
  line: PropTypes.object.isRequired,
  unknownFields: PropTypes.array.isRequired,
  onHover: PropTypes.func.isRequired
}

export default Line
