import SelectableItemList from '../components/selectable-item-list'
import theme from '@/theme/theme'

interface ColumnsSelectPropTypes {
  columns: Array<string>
  selectedColumns: Array<string>
  onAdd: Function
  onRemove: Function
}

export default function ColumnsSelect({ columns, selectedColumns, onAdd, onRemove }: ColumnsSelectPropTypes) {
  return (
    <div>
      <SelectableItemList
        list={columns.filter(col => !selectedColumns.includes(col)).map((col) => {
          return {
            key: col,
            value: col,
          }
        })}
        buttonIcon="+"
        action={onAdd}
      />

      <SelectableItemList
        list={selectedColumns.map((col) => {
          return {
            key: col,
            value: col,
          }
        })}
        buttonIcon="-"
        action={onRemove}
      />
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
          border: 1px solid ${theme.colors.grey.border};
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
          color: ${theme.colors.primary.badge};
          background-color: ${theme.colors.primary.bg};
        }
      `}
      </style>
    </div>
  )
}
