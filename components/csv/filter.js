import React from 'react'
import PropTypes from 'prop-types'

class Filter extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    const {onSelect} = this.props
    onSelect(event.target.value)
  }

  render() {
    const {selected, columns} = this.props

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
        `}</style>
      </div>
    )
  }
}

Filter.propTypes = {
  selected: PropTypes.string,
  columns: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired
}

Filter.defaultProps = {
  selected: ''
}

export default Filter
