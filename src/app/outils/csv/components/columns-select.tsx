import SelectableItemList from '../components/selectable-item-list'
import { ColumnSelectWrapper } from './columns-select.style'

interface ColumnsSelectPropTypes {
  columns: Array<string>
  selectedColumns: Array<string>
  onAdd: Function
  onRemove: Function
}

export default function ColumnsSelect({ columns, selectedColumns, onAdd, onRemove }: ColumnsSelectPropTypes) {
  return (
    <ColumnSelectWrapper>
      <SelectableItemList
        list={columns.filter(col => !selectedColumns.includes(col)).map((col) => {
          return {
            key: col,
            value: col,
          }
        })}
        key="addItemList"
        buttonIcon="+"
        action={onAdd}
      />

      <SelectableItemList
        key="removeItemList"
        list={selectedColumns.map((selectedColumn) => {
          return {
            key: selectedColumn,
            value: selectedColumn,
          }
        })}
        buttonIcon="-"
        action={onRemove}
      />
    </ColumnSelectWrapper>
  )
}
