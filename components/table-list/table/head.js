import PropTypes from 'prop-types'
import {ArrowDown} from 'react-feather'
import Header from './header'

const order = (a, b, direction) => (
  <button
    type='button'
    style={{display: 'inline-flex', border: 'none', background: 'none', color: 'white'}}
    aria-label={`Trier par ordre ${direction === 'asc' ? 'croissant' : 'décroissant'}`}
  >
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
  </button>
)

const alphabetical = {
  asc: order('Z', 'A', 'asc'),
  desc: order('A', 'Z', 'desc')
}

const numeric = {
  asc: order('9', '1', 'asc'),
  desc: order('1', '9', 'desc')
}

const sortTypes = {alphabetical, numeric}

function Head({headers, order, selectColumn, actived}) {
  return (
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
}

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
