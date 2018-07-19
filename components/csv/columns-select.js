import React from 'react'
import PropTypes from 'prop-types'

import SelectableItemList from '../selectable-item-list'

import theme from '../../styles/theme'

const ColumnsSelect = ({columns, selectedColumns, onAdd, onRemove}) => (
  <div>
    <SelectableItemList
      list={columns.filter(col => !selectedColumns.includes(col)).map(col => {
        return {
          key: col,
          value: col
        }
      })}
      buttonIcon='+'
      action={item => onAdd(item.value)} />

    <SelectableItemList
      list={selectedColumns.map(col => {
        return {
          key: col,
          value: col
        }
      })}
      buttonIcon='-'
      action={item => onRemove(item.value)} />
    <style jsx>{`
        .columns {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(auto, 200px));
          grid-gap: 5px;
        }

        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid ${theme.colors.lightGrey};
        }

        .item:hover {
          cursor: pointer;
        }

        .column {
          margin: 0 1em;
        }

        .selection {
          margin: 2em 0;
          padding: 0.5em;
          border: 1px dashed #ccc;
        }

        .button {
          font-size: larger;
          font-weight: bold;
          text-align: center;
          width: 20px;
          color: ${theme.colors.white};
          background-color: ${theme.backgroundColor};
        }
      `}</style>
  </div>
)

ColumnsSelect.propTypes = {
  columns: PropTypes.array.isRequired,
  selectedColumns: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
}

export default ColumnsSelect
