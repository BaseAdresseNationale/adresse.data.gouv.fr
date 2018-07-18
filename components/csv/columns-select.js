import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../styles/theme'

const ColumnsSelect = ({columns, selectedColumns, onAdd, onRemove}) => (
  <div>
    <div className='columns'>
      {columns.filter(col => !selectedColumns.includes(col))
        .map(column => (
          <div key={column} className='item' onClick={() => onAdd(column)}>
            <div className='column'>{column}</div>
            <div className='button'>+</div>
          </div>
        ))}
    </div>
    <div className={`${selectedColumns.length && 'columns selection'}`}>
      {selectedColumns.map(column => (
        <div key={column} className='item' onClick={() => onRemove(column)}>
          <div className='column'>{column}</div>
          <div className='button'>-</div>
        </div>
      ))}
    </div>
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
