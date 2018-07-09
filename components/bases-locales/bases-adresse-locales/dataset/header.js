import React from 'react'
import PropTypes from 'prop-types'

import Info from '../info'

import Tag from '../../../tag'

class Header extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    info: PropTypes.shape({
      title: PropTypes.string.isRequired,
      children: PropTypes.node.isRequired
    }),
    placeName: PropTypes.bool
  }

  static defaultProps = {
    info: null
  }

  render() {
    const {name, logo, info, placeName} = this.props

    return (
      <div className='head'>
        <div>
          <h1>{name} <span>{placeName && <Tag type='toponyme' />}</span></h1>
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

          .head span {
            display: inline-flex;
          }

          .head img {
            width: 30%;
            min-width: 160px;
            max-width: 260px;
          }

          @media (max-width: 520px) {
            .head {
              flex-flow: column-reverse;
            }

            .head img {
              width: 100%;
            }
          }

        `}</style>
      </div>
    )
  }
}

export default Header
