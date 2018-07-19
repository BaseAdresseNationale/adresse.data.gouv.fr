import React from 'react'
import PropTypes from 'prop-types'
import FaCheck from 'react-icons/lib/fa/check'

import Button from '../../../button'

class TextInput extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired
  }

  static defaultProps = {
    placeholder: ''
  }

  state = {
    input: ''
  }

  handleChange = event => {
    event.preventDefault()
    this.setState({input: event.target.value})
  }

  handleSubmit = event => {
    const {handleSubmit} = this.props
    const {input} = this.state

    event.preventDefault()

    handleSubmit(input)
    this.setState({input: ''})
  }

  render() {
    const {input} = this.state
    const {placeholder} = this.props

    return (
      <form>
        <input type='text' placeholder={placeholder} value={input} onChange={this.handleChange} />
        <Button
          style={{margin: '5px'}}
          size='small'
          color='green'
          type='submit'
          onClick={this.handleSubmit}
        >
          <FaCheck />
        </Button>

        <style jsx>{`
          form {
            display: flex;
            width: 100%;
          }
        `}</style>
      </form>
    )
  }
}

export default TextInput
