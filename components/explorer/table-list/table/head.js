import React from 'react'
import PropTypes from 'prop-types'

import {ArrowDown} from 'react-feather'

import Header from './header'

const typesStyle = {
  display: 'flex',
  flexDirection: 'column',
  fontSize: '14px',
  lineHeight: '14px',
  marginLeft: '3px',
  marginTop: '-2px'
}

const types = {
  alphabetical: {
    asc: (
      <div style={{
        display: 'inline-flex'
      }}
      >
        <ArrowDown />
        <div style={typesStyle}>
          <div>A</div>
          <div>Z</div>
        </div>
      </div>
    ),
    desc: (
      <div style={{
        display: 'inline-flex'
      }}
      >
        <ArrowDown />
        <div style={typesStyle}>
          <div>Z</div>
          <div>A</div>
        </div>
      </div>
    )
  },
  numeric: {
    asc: (
      <div style={{
        display: 'inline-flex'
      }}
      >
        <ArrowDown />
        <div style={typesStyle}>
          <div>1</div>
          <div>9</div>
        </div>
      </div>
    ),
    desc: (
      <div style={{
        display: 'inline-flex'
      }}
      >
        <ArrowDown />
        <div style={typesStyle}>
          <div>9</div>
          <div>1</div>
        </div>
      </div>
    )
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
