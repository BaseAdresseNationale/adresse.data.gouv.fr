import React from 'react'
import PropTypes from 'prop-types'

class Organization extends React.Component {
  render() {
    const {page, logo, name} = this.props
    return (
      <div className='organization'>
        <a href={page}>
          <div><img src={logo} /></div>
          <div>{name}</div>
        </a>

        <style jsx>{`
          .organization {
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            max-width: 130px;
            margin: 1em 0;
          }

          .organization img {
            width: 100px;
          }
          `}</style>
      </div>
    )
  }
}

Organization.propTypes = {
  name: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  page: PropTypes.string.isRequired
}

export default Organization
