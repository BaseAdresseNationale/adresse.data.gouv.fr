import React from 'react'
import PropTypes from 'prop-types'

class Dataset extends React.Component {
  render() {
    const {dataset} = this.props
    return (
      <div>
        <h1>{dataset.title}</h1>
      </div>
    )
  }
}

Dataset.propTypes = {
  dataset: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    license: PropTypes.string.isRequired,
    licenseLabel: PropTypes.string.isRequired,
    organization: PropTypes.object.isRequired,
    page: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    valid: PropTypes.bool,
    error: PropTypes.object
  }).isRequired
}

Dataset.defaultProps = {
  valid: false,
  error: null
}

export default Dataset
