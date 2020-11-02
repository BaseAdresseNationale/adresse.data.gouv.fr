import React from 'react'
import PropTypes from 'prop-types'

class Organization extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    logo: PropTypes.string,
    size: PropTypes.oneOf([
      'standard',
      'big'
    ])
  }

  static defaultProps = {
    size: 'standard',
    name: null,
    logo: '/images/no-img.png'
  }

  render() {
    const {logo, name, size} = this.props
    return (
      <div className='organization'>
        <div className={size}><img src={logo} alt={name} /></div>
        <div>{name}</div>

        <style jsx>{`
          .organization {
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            max-width: 200px;
          }

          .standard img {
            width: 100px;
          }

          .big img {
            width: 200px;
          }
          `}</style>
      </div>
    )
  }
}

export default Organization
