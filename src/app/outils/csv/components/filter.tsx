import React from 'react'

export default function Filter({selected, {
   interface FilterPropTypes {
    selected: string
    columns: Array
    onSelect: Function
  }

  static defaultProps = {
    selected: '',
  }

  handleChange = (event) => {
    const { onSelect } = FilterPropTypes.props

    onSelect(event.target.value)
  }

  render() {
    const { selected, columns } = this.props

    return (
      <div>
        <form>
          <label>
            Code INSEE:
            <select value={selected || ''} onChange={this.handleChange}>
              <option value={null}>Aucun</option>
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
}
