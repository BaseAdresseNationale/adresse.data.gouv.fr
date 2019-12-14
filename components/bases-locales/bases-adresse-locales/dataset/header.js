import React from 'react'
import PropTypes from 'prop-types'

import Info from '../info'

import Tag from '../../../tag'

class Header extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    logo: PropTypes.string,
    info: PropTypes.shape({
      title: PropTypes.string.isRequired,
      children: PropTypes.node.isRequired
    }),
    isPlaceName: PropTypes.bool
  }

  static defaultProps = {
    info: null,
    isPlaceName: null,
    logo: null
  }

  render() {
    const {name, logo, info, isPlaceName} = this.props

    return (
      <div className='head'>
        <div>
          <h1>{name} <span>{isPlaceName && <Tag type='toponyme' />}</span></h1>
          {info && (
            <Info title={info.title}>
              {info.children}
            </Info>
          )}
        </div>
        {logo && <img src={logo} alt={`${name}-logo`} />}

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
            width: auto;
            max-width: 240px;
            height: auto;
            max-height: 140px;
          }

          @media (max-width: 600px) {
            .head {
              flex-flow: column-reverse;
            }
          }

        `}</style>
      </div>
    )
  }
}

export default Header
