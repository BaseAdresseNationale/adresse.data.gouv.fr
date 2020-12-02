import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import {ChevronRight} from 'react-feather'

import theme from '@/styles/theme'

class Breadcrumb extends React.Component {
  static propTypes = {
    current: PropTypes.string.isRequired,
    links: PropTypes.array.isRequired
  }

  render() {
    const {links, current} = this.props

    return (
      <div className='breadcrumb'>
        {links.map((link, idx) => (
          <Fragment key={link.link}>
            <Link href={link.href}>
              <a>{link.link}</a>
            </Link>
            {idx < links.length && <ChevronRight />}
          </Fragment>
        ))}
        {current}
        <style jsx>{`
          .breadcrumb {
            display: flex;
            align-items: center;
            flex-flow: wrap;
            margin: 1em 0;
          }

          a {
            color: ${theme.darkText};
            text-decoration: none;
          }

          a:hover {
            text-decoration: underline;
          }
        `}</style>
      </div>
    )
  }
}

export default Breadcrumb
