import React from 'react'
import PropTypes from 'prop-types'

import {ArrowDown} from 'react-feather'

import Header from './header'

const order = (a, b) => (
  <div style={{display: 'inline-flex'}}>
    <ArrowDown />
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      fontSize: '14px',
      lineHeight: '14px',
      marginLeft: '3px',
      marginTop: '-2px'
    }}
    >
      <div>{a}</div>
      <div>{b}</div>
    </div>
  </div>
)

const alphabetical = {
  asc: order('Z', 'A'),
  desc: order('A', 'Z')
}

const numeric = {
  asc: order('9', '1'),
  desc: order('1', '9')
}

const sortTypes = {alphabetical, numeric}

const Head = ({headers, order, selectColumn, actived}) => (
  <tbody>
    <tr>
      {Object.keys(headers).map(header => {
        const {title, sortBy, getValue} = headers[header]

        return getValue ?
          <Header
            key={title}
            title={title}
            icon={sortTypes[sortBy][order]}
            handleSelect={selectColumn}
            isActived={title === actived} /> :
          <Header
            key={title}
            title={title} />
      })}
    </tr>
  </tbody>
)

Head.propTypes = {
  headers: PropTypes.object.isRequired,
  selectColumn: PropTypes.func.isRequired,
  actived: PropTypes.string,
  order: PropTypes.oneOf(['asc', 'desc'])
}

Head.defaultProps = {
  actived: null,
  order: 'asc'
}

export default Head
