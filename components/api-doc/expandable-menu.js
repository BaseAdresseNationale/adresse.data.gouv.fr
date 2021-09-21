import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../styles/theme'

class ExpandableMenu extends React.Component {
  static propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]).isRequired,
    children: PropTypes.node.isRequired
  }

  state = {expanded: false}

  expand = this.expand.bind(this)

  expand() {
    this.setState(state => ({
      expanded: !state.expanded
    }))
  }

  render() {
    const {expanded} = this.state
    const {title, children} = this.props
    return (
      <div className='expandable-menu-container' onClick={this.expand}>
        <div className='head'>
          <div className='title'>{title}</div>
          <img className={`${expanded ? 'reverse' : ''}`} src='/images/icons/arrow-down.svg' />
        </div>

        {expanded && children}

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

          .head img {
            width: 20px;
            margin: 3px 0.5em 0 1em;
            display: inline-block;
          }

          .title {
            font-size: 16px;
            font-weight: 600;
            width: 100%;
          }

          img.reverse {
            -webkit-transform: scaleY(-1);
            transform: scaleY(-1);
          }
          `}</style>
      </div>
    )
  }
}

export default ExpandableMenu
