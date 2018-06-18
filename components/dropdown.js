import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import theme from '../styles/theme'

class Dropdown extends React.Component {
  static propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]).isRequired,
    links: PropTypes.arrayOf(PropTypes.shape({
      action: PropTypes.func,
      text: PropTypes.string.isRequired
    })).isRequired
  }

  state = {
    visible: false
  }

  componentDidMount() {
    window.addEventListener('mousedown', this.closeDropdown)
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.closeDropdown)
  }

  setDropdownRef = node => {
    this.dropdownRef = node
  }

  handleDropdown = e => {
    e.preventDefault()

    this.setState(state => ({
      visible: !state.visible
    }))
  }

  closeDropdown = event => {
    if (this.dropdownRef && !this.dropdownRef.contains(event.target)) {
      this.setState(() => ({
        visible: false
      }))
    }
  }

  render() {
    const {title, links} = this.props
    const {visible} = this.state

    return (
      <div ref={this.setDropdownRef} className='dropdown' onClick={this.handleDropdown}>
        <a>{title}</a>

        {visible && (
          <div className='content'>
            {links.map(link => (
              <Link key={link.text} href={link.href}>
                <a>{link.text}</a>
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

          a {
            color: ${theme.colors.black};
          }

          .content {
            position: absolute;
            background-color: ${theme.colors.white};
            padding: 1em;
            display: grid;
            grid-row-gap: 5px;
            right: 0;
            text-align: left;
            box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
            z-index: 2;
          }

          .content div:hover {
            background-color: ${theme.backgroundGrey};
          }

          @media (min-width: 552px) {
            a {
              padding: 0.4em 0.8em;
              border-radius: 3px;
            }

            a:hover {
              background: ${theme.colors.lighterGrey};
              transition: background ease-out 0.5s;
            }
          }
        `}</style>
      </div>
    )
  }
}

export default Dropdown
