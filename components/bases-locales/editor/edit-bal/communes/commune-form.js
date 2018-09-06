import React from 'react'
import PropTypes from 'prop-types'

import Notification from '../../../../notification'

import SearchCommune from '../../../init-base/search-communes'

class CommuneForm extends React.Component {
  static propTypes = {
    submit: PropTypes.func.isRequired,
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Error)
    ])
  }

  static defaultProps = {
    error: null
  }

  handleSave = commune => {
    const {submit} = this.props
    submit(commune)
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
