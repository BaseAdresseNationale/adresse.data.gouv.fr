import React from 'react'
import PropTypes from 'prop-types'

import Notification from '../../../notification'

import SearchCommune from '../../init-base/search-communes'

class CommuneForm extends React.Component {
  static propTypes = {
    add: PropTypes.func.isRequired,
    error: PropTypes.string
  }

  static defaultProps = {
    error: null
  }

  handleSave = async event => {
    const {add} = this.props

    event.preventDefault()
    await add(event.target.value)
  }

  render() {
    const {error} = this.props

    return (
      <div>
        <SearchCommune handleSelect={this.handleSave} />

        {error && (
          <Notification style={{marginTop: '1em'}} type='error' message={error.message} />
        )}
      </div>
    )
  }
}

export default CommuneForm
