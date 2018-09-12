import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../styles/theme'

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
      <div className='commune-form shadow-box'>
        <h3>Ajout d’une nouvelle commune</h3>

        <SearchCommunes handleSelect={this.handleSave} />

        {error && (
          <Notification style={{marginTop: '1em'}} type='error'>
            {error.message}
          </Notification>
        )}

        <style jsx>{`
          .shadow-box {
            border: 1px solid ${theme.border};
            box-shadow: 0 1px 4px 0 ${theme.boxShadow};
            padding: 1em;
          }
        `}</style>
      </div>
    )
  }
}

export default CreateCommune
