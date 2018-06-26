import React from 'react'
import PropTypes from 'prop-types'

import Info from '../info'

class Header extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    info: PropTypes.shape({
      title: PropTypes.string.isRequired,
      children: PropTypes.node.isRequired
    })
  }

  static defaultProps = {
    info: null
  }

  render() {
    const {name, logo, info} = this.props

    return (
      <div className='head'>
        <div>
          <h1>{name}</h1>
          {info && (
            <Info title={info.title}>
              {info.children}
            </Info>
          )}
        </div>
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
