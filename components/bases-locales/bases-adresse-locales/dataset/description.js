import React from 'react'
import PropTypes from 'prop-types'

class Description extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }

  render() {
    const {title, description} = this.props

    return (
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    )
  }
}

export default Description
