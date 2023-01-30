import React from 'react'
import PropTypes from 'prop-types'

import IEWarning from '@/components/ie-warning'
import Meta from '@/components/meta'
import Header from '@/components/header'
import Footer from '@/components/footer'

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    hasFooter: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string
  }

  static defaultProps = {
    children: null,
    hasFooter: true,
    title: null,
    description: null,
    image: null
  }

  render() {
    const {title, description, image, children, hasFooter} = this.props

    return (
      <>
        <Meta title={title} description={description} image={image} />
        <IEWarning />
        <Header />
        <main className='template-data-gouv'>
          {children}
        </main>
        {hasFooter && <Footer />}

        <style jsx>{`
          main {
            flex: 1;
            background-color: #fff;
          }
        `}</style>
      </>
    )
  }
}

export default Layout
