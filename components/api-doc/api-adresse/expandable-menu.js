import {useState} from 'react'
import PropTypes from 'prop-types'
import {ChevronDown, ChevronUp} from 'react-feather'

import theme from '../../../styles/theme'

import ActionButtonNeutral from '@/components/action-button-neutral'

function ExpandableMenu({title, children, label}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <ActionButtonNeutral
      label={`${isExpanded ? 'Masquer' : 'Afficher'} la documentation de ${label}`}
      onClick={() => setIsExpanded(!isExpanded)}
      isFullSize
    >
      <div className='expandable-menu-container'>
        <div className='head'>
          <div className='title'>{title}</div>
          <div style={{paddingLeft: '.5em'}}>
            {isExpanded ? (
              <ChevronUp style={{verticalAlign: 'middle'}} size={38} alt />
            ) : (
              <ChevronDown style={{verticalAlign: 'middle'}} size={38} alt />
            )}
          </div>
        </div>

        {isExpanded && children}
      </div>

      <style jsx>{`
        .expandable-menu-container {
          width: 100%;
          margin: 0.5em 0;
          padding: 0.5em;
          background: ${theme.colors.white};
          border-radius: 3px;
          text-align: left;
        }

        .head {
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
    </ActionButtonNeutral>
  )
}

ExpandableMenu.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default ExpandableMenu
