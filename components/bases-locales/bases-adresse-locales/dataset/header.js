import React from 'react'
import PropTypes from 'prop-types'

class Header extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired
  }
  render() {
    const {name, logo} = this.props

    return (
      <div className='head'>
        <h1>{name}</h1>
        <img src={logo} alt={`${name}-logo`} />

        <style jsx>{`
          .head {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .head img {
            width: 30%;
            min-width: 160px;
            max-width: 260px;
          }

        `}</style>
      </div>
    )
  }
}

export default Header
