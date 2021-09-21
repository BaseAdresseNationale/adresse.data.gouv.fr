import PropTypes from 'prop-types'
import React from 'react'

import Button from '../../button'

class InputExemple extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    copy: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    const {copy, value} = this.props
    copy(`curl '${value}'`)
  }

  render() {
    const {value} = this.props

    return (
      <div>
        <div className='exemple'>
          <input type='text' value={`curl '${value}'`} readOnly />
          <Button style={{borderRadius: '0 5px 5px 0'}} onClick={this.handleClick}>Copier</Button>
        </div>
        <style jsx>{`
          .exemple {
            display: flex;
          }

          input {
            border-radius: 5px 0 0 5px;
          }
          `}</style>
      </div>
    )
  }
}

export default InputExemple
