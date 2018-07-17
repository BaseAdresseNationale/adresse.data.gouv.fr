import React from 'react'
import PropTypes from 'prop-types'

class Filter extends React.Component {
  static propTypes = {
    selected: PropTypes.string,
    columns: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired
  }

  static defaultProps = {
    selected: ''
  }

  handleChange = event => {
    const {onSelect} = this.props

    onSelect(event.target.value)
  }

  render() {
    const {selected, columns} = this.props

    return (
      <div>
        <form>
          <label>
            Code INSEE: <select value={selected || ''} onChange={this.handleChange}>
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
        `}</style>
      </div>
    )
  }
}

export default Filter
