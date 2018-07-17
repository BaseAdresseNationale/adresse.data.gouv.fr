import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import theme from '../styles/theme'

const HeadLinkTitle = ({title, subtitle, href, icon}) => {
  return (
    <div className='data'>
      <div className='icon'>
        {icon && icon}
      </div>
      <div>
        <h2><Link href={href}><a>{title}</a></Link></h2>
        <p>{subtitle}</p>
      </div>

      <style jsx>{`
        a {
          color: ${theme.darkText};
          text-decoration: underline;
        }

        .data {
          display: flex;
          align-items: center;
        }

        .icon {
          margin-right: 1em;
          font-size: 32px;
        }
        `}</style>
    </div>
  )
}

HeadLinkTitle.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  icon: PropTypes.element
}

HeadLinkTitle.defaultProps = {
  icon: null
}

export default HeadLinkTitle
