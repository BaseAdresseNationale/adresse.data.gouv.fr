import React from 'react'
import PropTypes from 'prop-types'

import Head from './head'

class SideMenu extends React.Component {
  static propTypes = {
    context: PropTypes.object.isRequired,
    exportControls: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired
  }

  render() {
    const {context, exportControls, children} = this.props

    return (
      <div className='side-menu'>
        <div className='context'>
          <div className='head'>
            <Head {...context} />
          </div>

          <div className='body'>
            {children}
          </div>

          <div className='bottom'>
            {exportControls}
          </div>
        </div>

        <style jsx>{`
          .side-menu {
            display: flex;
            flex-direction: column;
            width: 30%;
            max-height: 100vh;
          }

          .context {
            display: flex;
            flex-direction: column;
            height: 100%;
          }

          .body {
            display: flex;
            flex-grow: 1;
            margin: 0 1em 1em 1em;
          }
        `}</style>
      </div>
    )
  }
}

export default SideMenu
