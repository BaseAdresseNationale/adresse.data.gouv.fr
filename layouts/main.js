import React from 'react'
import PropTypes from 'prop-types'

import IEWarning from '../components/ie-warning'
import Meta from '../components/meta'
import Header from '../components/header'
import Footer from '../components/footer'

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    hasFooter: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string
  }

  static defaultProps = {
    children: null,
    hasFooter: true,
    title: null,
    description: null
  }

  render() {
    const {title, description, children, hasFooter} = this.props

    return (
      <div>
        <Meta title={title} description={description} />
        <IEWarning />
        <Header />
        <main>
          {children}
        </main>
        {hasFooter && <Footer />}

        <style jsx>{`
          div {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background-color: #fff;
          }

          main {
            flex: 1;
          }
        `}</style>
      </div>
    )
  }
}

export default Layout
