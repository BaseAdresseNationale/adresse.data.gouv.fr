import React from 'react'
import PropTypes from 'prop-types'

import Header from './header'

const Head = ({headers}) => (
  <tbody>
    <tr>
      {headers.map(header => (
        <Header key={header.title} {...header} />
      ))}
    </tr>
  </tbody>
)

Head.propTypes = {
  headers: PropTypes.array.isRequired
}

export default Head
