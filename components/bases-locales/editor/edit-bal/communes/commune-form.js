import React from 'react'
import PropTypes from 'prop-types'

import Notification from '../../../../notification'

import SearchCommune from '../../../init-base/search-communes'

import ClosablePanel from '../closable-panel'

class Commune extends React.Component {
  static propTypes = {
    submit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    error: PropTypes.instanceOf(Error)
  }

  static defaultProps = {
    error: null
  }

  render() {
    const {submit, close, error} = this.props

    return (
      <ClosablePanel title='Ajouter une commune' handleClose={close}>
        <SearchCommune handleSelect={submit} />

        {error && (
          <Notification style={{marginTop: '1em'}} type='error' message={error.message} />
        )}
      </ClosablePanel>
    )
  }
}

export default Commune
