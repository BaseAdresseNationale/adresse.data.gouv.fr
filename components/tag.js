import PropTypes from 'prop-types'

import {getType} from '@/lib/types'

function Tag({type, style}) {
  const tag = getType(type)
  return (
    <div className={`tag ${type}`} style={style}>
      {type}
      <style jsx>{`
        .tag {
          display: flex;
          margin: 2px;
          font-size: 12px;
          color: ${tag.color};
          background-color: ${tag.background};
          padding: 2px 4px;
          border-radius: 2px;
          justify-content: center;
          align-items: center;
        }
        `}</style>
    </div>
  )
}

Tag.propTypes = {
  type: PropTypes.string.isRequired,
  style: PropTypes.object
}

Tag.defaultProps = {
  style: null
}

export default Tag
