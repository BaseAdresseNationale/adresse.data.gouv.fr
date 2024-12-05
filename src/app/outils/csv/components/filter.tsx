import React from 'react'

interface FilterPropTypes {
  selected: string
  columns: string[]
  onSelect: Function
}

export default function Filter({ selected = '', columns, onSelect }: FilterPropTypes) {
  return (
    <div>
      <form>
        <label>
          Code INSEE:
          <select value={selected || ''} onChange={event => onSelect(event.target.value)}>
            <option value={undefined}>Aucun</option>
            {columns.map(column =>
              <option key={column} value={column}>{column}</option>
            )}
          </select>
        </label>
      </form>
      <style jsx>{`
          form {
            margin: 1em 0;
          }
        `}
      </style>
    </div>
  )
}
