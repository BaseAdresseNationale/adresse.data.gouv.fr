import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import {Menu, X} from 'react-feather'

import theme from '@/styles/theme'

class HamburgerMenu extends React.Component {
  static propTypes = {
    links: PropTypes.arrayOf(PropTypes.shape({
      action: PropTypes.func,
      text: PropTypes.string.isRequired
    })).isRequired
  }

  state = {
    visible: false
  }

  handleMenu = e => {
    e.preventDefault()

    this.setState(state => ({
      visible: !state.visible
    }))
  }

  render() {
    const {links} = this.props
    const {visible} = this.state

    return (
      <div className='dropdown'>
        <button type='button' aria-label={`${visible ? 'Fermer' : 'Ouvrir'} le menu de navigation`} onClick={this.handleMenu}>
          {visible ? <X size={22} /> : <Menu size={22} />}
        </button>

        {visible && (
          <div className='content'>
            {links.map(link => (
              <Link key={link.text} href={link.href} passHref>
                <a aria-label={`Visiter la page ${link.text}`}>{link.text}</a>
              </Link>
            ))}
          </div>
        )}

        <style jsx>{`
          .dropdown {
            position: relative;
            display: inline-block;
            cursor: pointer;
          }

          .dropdown button {
            border: none;
            background: none;
          }

          a {
            color: ${theme.colors.black};
            padding: 0.4em 0.8em;
            border-radius: 3px;
          }

          a:hover {
            background: ${theme.colors.lighterGrey};
            transition: background ease-out 0.5s;
          }

          .content {
            position: absolute;
            background-color: ${theme.colors.white};
            padding: 1em;
            display: grid;
            grid-row-gap: 5px;
            grid-auto-columns: max-content;
            right: 0;
            text-align: left;
            box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
            z-index: 2;
          }

          .content div:hover {
            background-color: ${theme.backgroundGrey};
          }
        `}</style>
      </div>
    )
  }
}

export default HamburgerMenu
