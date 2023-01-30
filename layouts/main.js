import React from 'react'
import PropTypes from 'prop-types'

import IEWarning from '@/components/ie-warning'
import Meta from '@/components/meta'
import Header from '@/components/header'
import FooterDsfr from '@/components/footer'

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    hasFooter: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    isLegacy: PropTypes.bool,
  }

  static defaultProps = {
    children: null,
    hasFooter: true,
    title: null,
    description: null,
    image: null,
    isLegacy: true,
  }

  render() {
    const {title, description, image, children, hasFooter, isLegacy} = this.props

    return (
      <>
        <Meta title={title} description={description} image={image} />
        <IEWarning />
        <Header />
        <main className={isLegacy && 'template-data-gouv'}>
          {children}
        </main>
        {hasFooter && <FooterDsfr />}

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
