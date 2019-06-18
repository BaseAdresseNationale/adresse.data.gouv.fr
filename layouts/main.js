import React from 'react'
import PropTypes from 'prop-types'

import Meta from '../components/meta'
import Header from '../components/header'
import Footer from '../components/footer'

class Layout extends React.Component {
  render() {
    const {title, description, children, showFooter} = this.props

    return (
      <div>
        <Meta title={title} description={description} />
        <Header />
        <main>
          {children}
        </main>
        {showFooter && <Footer />}

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

Layout.propTypes = {
  children: PropTypes.node,
  showFooter: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string
}

Layout.defaultProps = {
  children: null,
  showFooter: true,
  title: null,
  description: null
}

export default Layout
