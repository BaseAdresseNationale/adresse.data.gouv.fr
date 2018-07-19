import React from 'react'
import PropTypes from 'prop-types'
import FaClose from 'react-icons/lib/fa/close'

import theme from '../../../../styles/theme'

class ClosablePanel extends React.Component {
  render() {
    const {title, children, handleClose} = this.props

    return (
      <div className='panel'>
        <div className='header'>
          <h3>{title}</h3>
          <div className='close' onClick={handleClose}><FaClose size={24} /></div>
        </div>
        {children}
        <style jsx>{`
          .panel {
            display: flex;
            flex-direction: column;
            padding: 2em 1em;
            box-shadow: 0 1px 4px ${theme.boxShadow};
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
          }

          .close {
            padding: 1em;
          }

          .close:hover {
            cursor: pointer;
            background-color: whitesmoke;
          }
        `}</style>
      </div>
    )
  }
}

ClosablePanel.propTypes = {
  title: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
}

ClosablePanel.defaultProps = {
  title: ''
}

export default ClosablePanel
