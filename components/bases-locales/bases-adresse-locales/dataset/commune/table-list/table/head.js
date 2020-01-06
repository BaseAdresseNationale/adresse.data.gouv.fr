import React from 'react'
import PropTypes from 'prop-types'

import FaSortAlphaAsc from 'react-icons/lib/fa/sort-alpha-asc'
import FaSortAlphaDesc from 'react-icons/lib/fa/sort-alpha-desc'
import FaSortNumericAsc from 'react-icons/lib/fa/sort-numeric-asc'
import FaSortNumericDesc from 'react-icons/lib/fa/sort-numeric-desc'

import Header from './header'

const types = {
  alphabetical: {
    asc: <FaSortAlphaAsc />,
    desc: <FaSortAlphaDesc />
  },
  numeric: {
    asc: <FaSortNumericAsc />,
    desc: <FaSortNumericDesc />
  }
}

const Head = ({headers, order, sort, actived}) => (
  <tbody>
    <tr>
      {headers.map(({title, type, func}) => {
        return func ?
          <Header
            key={title}
            title={title}
            icon={types[type][order]}
            sort={() => sort(func, title)}
            isActived={title === actived} /> :
          <Header
            key={title}
            title={title} />
      })}
    </tr>
  </tbody>
)

Head.propTypes = {
  headers: PropTypes.array.isRequired,
  sort: PropTypes.func.isRequired,
  actived: PropTypes.string,
  order: PropTypes.oneOf(['asc', 'desc'])
}

Head.defaultProps = {
  actived: null,
  order: 'asc'
}

export default Head
