import React from 'react'
import PropTypes from 'prop-types'

class Title extends React.Component {
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

  static propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired
  }
}

export default Title
