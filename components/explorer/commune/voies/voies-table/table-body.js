import React from 'react'
import PropTypes from 'prop-types'

import FaCheck from 'react-icons/lib/fa/check'

import theme from '../../../../../styles/theme'

class TableBody extends React.Component {
  render() {
    const {voies} = this.props
    return (
      <tbody>
        {voies.map(voie => (
          <tr key={voie.name}>
            <td>{voie.name}</td>
            <td>{voie.numbers.length}</td>
            <td>{voie.lieuDit ? <FaCheck /> : ''}</td>
          </tr>
        ))}
        <style jsx>{`
          td {
            border: 1px solid ${theme.border};
            padding: 8px;
          }

          tr:nth-child(even) {
            background-color: ${theme.backgroundGrey};
          }

          tr:hover {
            background-color: ${theme.colors.lightGrey};
          }
          `}</style>
      </tbody>
    )
  }
}

TableBody.propTypes = {
  voies: PropTypes.array.isRequired
}

export default TableBody
