import React from 'react'
import PropTypes from 'prop-types'

import Notification from '../../../../notification'

import SearchCommune from '../../../init-base/search-communes'
import ClosablePanel from '../closable-panel'

class CommuneForm extends React.Component {
  static propTypes = {
    submit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
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
    const {close, error} = this.props

    return (
      <ClosablePanel title='Ajouter une nouvelle commune' handleClose={close}>
        <SearchCommune handleSelect={this.handleSave} />

        {error && (
          <Notification style={{marginTop: '1em'}} type='error' message={error.message} />
        )}
      </ClosablePanel>
    )
  }
}

export default CommuneForm
