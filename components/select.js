import React from 'react'
import PropTypes from 'prop-types'

class Select extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    options: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired
  }

  static defaultProps = {
    value: null
  }

  handleChange = e => {
    const {onSubmit} = this.props
    e.preventDefault()

    onSubmit(e.target.value)
  }

  render() {
    const {value, options} = this.props

    return (
      <div>
        <div className='select'>
          <select value={value} onChange={this.handleChange}>
            {options.map(options => (
              <option key={options} value={options}>
                {options}
              </option>
            ))}
          </select>
        </div>

        <style jsx>{`
          .select {
            margin-bottom: 1em;
          }

          select {
            text-transform: capitalize;
          }

          select option::first-letter{
            text-transform: uppercase;
          }
        `}</style>
      </div>
    )
  }
}

export default Select
