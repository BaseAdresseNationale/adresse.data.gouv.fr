import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../styles/theme'

const Body = ({list, cols, isSelected, handleSelect}) => {
  return (
    <tbody>
      {list.map((item, idx) => (
        <tr
          key={`tr-${idx}`} // eslint-disable-line react/no-array-index-key
          className={`${isSelected && isSelected(item) ? 'selected' : null}`}
          onClick={handleSelect ? () => handleSelect(item) : null}
        >
          {Object.keys(cols).map(col => (
            <td key={`${col}-${cols[col].getValue(item)}`}>
              {cols[col].getValue(item)}
            </td>
          ))}
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
        cursor: ${handleSelect ? 'pointer' : 'auto'};
        background-color: ${handleSelect ? theme.colors.lightGrey : null}
      }

      tr.fade-out {
        opacity: 0.6;
      }

      tr.fade-out td {
        border: 1px dotted ${theme.border};
      }

      tr.selected {
        background-color: ${theme.primaryDark};
        color: ${theme.colors.white};
      }
      `}</style>
    </tbody>
  )
}

Body.propTypes = {
  list: PropTypes.array.isRequired,
  cols: PropTypes.object.isRequired,
  handleSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
}

Body.defaultProps = {
  isSelected: null
}

export default Body
