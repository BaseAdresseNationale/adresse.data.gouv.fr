import React from 'react'
import PropTypes from 'prop-types'

import Notification from '../../../../notification'

import SearchCommunes from '../../../init-base/search-communes'

class CreateCommune extends React.Component {
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
        <h4>Ajout d’une nouvelle commune</h4>

        <SearchCommunes handleSelect={this.handleSave} />

        {error && (
          <Notification style={{marginTop: '1em'}} type='error'>
            {error.message}
          </Notification>
        )}
      </div>
    )
  }
}

export default CreateCommune
