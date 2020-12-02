import React from 'react'
import PropTypes from 'prop-types'

import {HelpCircle} from 'react-feather'

import theme from '@/styles/theme'

const UnknownFields = ({fields}) => (
  <div className='container'>
    {fields.length > 0 && (
      <table>
        <tbody>
          <tr>
            <th>Champs non reconnus</th>
          </tr>
          {fields.map(field => (
            <tr key={field}>
              <td>{field}</td>
              <td className='unknown'><HelpCircle /></td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
    <style jsx>{`
      .unknown {
        color: ${theme.colors.darkerGrey};
      }

      th, td {
        padding: 0.5em;
      }

      tr:nth-child(2n) {
        background-color: ${theme.backgroundGrey};
      }

      td:nth-child(2n) {
        text-align: center;
      }
    `}</style>
  </div>
)

UnknownFields.propTypes = {
  fields: PropTypes.array
}

UnknownFields.defaultProps = {
  fields: []
}

export default UnknownFields
