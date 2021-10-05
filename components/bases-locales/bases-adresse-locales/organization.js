import React from 'react'
import Image from 'next/image'
import PropTypes from 'prop-types'

class Organization extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    logo: PropTypes.string,
  }

  static defaultProps = {
    name: null,
    logo: '/images/no-img.png'
  }

  render() {
    const {logo, name} = this.props
    return (
      <div className='organization'>
        <Image width={100} height={100} objectFit='scale-down' src={logo} alt={name} />
        <div>{name}</div>

        <style jsx>{`
          .organization {
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            max-width: 200px;
          }
          `}</style>
      </div>
    )
  }
}

export default Organization
