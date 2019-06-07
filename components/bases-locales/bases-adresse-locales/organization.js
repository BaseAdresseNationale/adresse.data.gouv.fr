import React from 'react'
import PropTypes from 'prop-types'

class Organization extends React.Component {
  render() {
    const {logo, name, size} = this.props
    return (
      <div className='organization'>
        <div className={size}><img src={logo} /></div>
        <div>{name}</div>

        <style jsx>{`
          .organization {
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            margin: 1em 0;
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

Organization.propTypes = {
  name: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  size: PropTypes.oneOf([
    'standard',
    'big'
  ])
}

Organization.defaultProps = {
  size: 'standard'
}

export default Organization
