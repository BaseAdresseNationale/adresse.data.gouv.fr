import {useState} from 'react'
import PropTypes from 'prop-types'
import {ChevronDown, ChevronUp} from 'react-feather'

import theme from '../../../styles/theme'

function ExpandableMenu({title, children}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className='expandable-menu-container' onClick={() => setIsExpanded(!isExpanded)}>
      <div className='head'>
        <div className='title'>{title}</div>
        <div style={{paddingLeft: '.5em'}}>
          {isExpanded ? <ChevronUp style={{verticalAlign: 'middle'}} size={38} /> : <ChevronDown style={{verticalAlign: 'middle'}} size={38} />}
        </div>
      </div>

      {isExpanded && children}

      <style jsx>{`
        .expandable-menu-container {
          margin: 0.5em 0;
          padding: 0.5em;
          background: ${theme.colors.white};
          border-radius: 3px;
          color: ${theme.darkText};
        }

        .expandable-menu-container:hover {
          cursor: pointer;
        }

        .head {
          display: flex;
          justify-content: space-between;
          display: flex;
          align-items: center;
          min-height: 2em;
        }

        .title {
          font-size: 16px;
          font-weight: 600;
          width: 100%;
        }
        `}</style>
    </div>
  )
}

ExpandableMenu.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  children: PropTypes.node.isRequired
}

export default ExpandableMenu
