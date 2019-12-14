import React from 'react'
import PropTypes from 'prop-types'

class Title extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired
  }

  render() {
    const {title, subtitle} = this.props

    return (
      <div>
        <div className='head'>
          <h3>{title}</h3>
          <h5>{subtitle}</h5>
        </div>

        <style jsx>{`
            .head {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            `}</style>
      </div>
    )
  }
}

export default Title
