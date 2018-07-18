import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import FaAngleRight from 'react-icons/lib/fa/angle-right'

import theme from '../../../../styles/theme'

class WithLink extends React.Component {
  static propTypes = {
    link: PropTypes.string,
    children: PropTypes.node.isRequired
  }

  static defaultProps = {
    link: null
  }

  render() {
    const {link, children} = this.props

    if (link) {
      return (
        <Link href={link}>
          <a style={{color: 'black'}}>
            {children}
          </a>
        </Link>
      )
    }

    return children
  }
}

class Item extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    link: PropTypes.string
  }

  static defaultProps = {
    link: null
  }

  render() {
    const {name, link, children} = this.props

    return (
      <WithLink link={link}>
        <div className={`item ${link ? 'selectable' : ''}`}>
          <div className='infos'>
            <div className='name'><b>{name}</b></div>
            <div>
              {children}
            </div>
          </div>
          {link && <div className='link'><FaAngleRight /></div>}
          <style jsx>{`
            .container {
              width: 100;
              display: flex;
              flex-direction: column;
            }

            .item {
              display: flex;
              justify-content: space-between;
              align-item: center;
              border: 1px solid ${theme.border};
              padding: 1em;
              margin: 0.2em 0;
            }

            .infos {
              display: flex;
              flex-grow: 1;
              justify-content: space-between;
            }

            .name {
              font-size: 18px;
            }

            .selectable:hover {
              color: ${theme.colors.white};
              background-color: ${theme.primary};
            }

            .link {
              margin-left: 1em;
            }

            @media (max-width: 700px) {
              .item {
                flex-direction: column;
                align-items: center;
                flex-flow: wrap;
              }

              .infos {
                flex-direction: column;
              }

              .name {
                font-size: initial;
              }
            }
          `}</style>
        </div>
      </WithLink>
    )
  }
}

export default Item
