import React from 'react'
import PropTypes from 'prop-types'
import theme from '../../../../../../../styles/theme'

function fadeOut(wrapped, idx) {
  return wrapped && idx === 8 ? 'fade-out' : ''
}

function isSelected(selected, item) {
  return selected && selected.id === item.key ? 'isSelected' : ''
}

const Body = ({items, isWrapped, selected, handleSelect}) => (
  <tbody>
    {items.map((item, idx) => (
      <tr
        key={item.key}
        className={`${fadeOut(isWrapped, idx)} ${isSelected(selected, item)}`}
        onClick={() => handleSelect(item)}
      >
        {item.values.map((value, idx) =>
          <td key={idx}>{value}</td> // eslint-disable-line react/no-array-index-key
        )}
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
        cursor: pointer;
        background-color: ${theme.colors.lightGrey};
      }

      tr.fade-out {
        opacity: 0.6;
      }

      tr.fade-out td {
        border: 1px dotted ${theme.border};
      }

      tr.isSelected {
        background-color: ${theme.primaryDark};
        color: ${theme.colors.white};
      }
      `}</style>
  </tbody>
)

Body.propTypes = {
  items: PropTypes.array.isRequired,
  handleSelect: PropTypes.func.isRequired,
  selected: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  isWrapped: PropTypes.bool
}

Body.defaultProps = {
  selected: null,
  isWrapped: false
}

export default Body
