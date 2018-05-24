import React from 'react'
import PropTypes from 'prop-types'

class CodeInsee extends React.Component {
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
            Choisir une colonne:
          <select value={selected || ''} onChange={this.handleChange}>
            <option value={null}>Aucune</option>
            {columns.map(column =>
              <option key={column} value={column}>{column}</option>
            )}
          </select>
          </label>
        </form>
      </div>
    )
  }
}

CodeInsee.propTypes = {
  selected: PropTypes.string,
  columns: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired
}

CodeInsee.defaultProps = {
  selected: ''
}

export default CodeInsee
