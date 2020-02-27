import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

const regex = /^http?/

const ButtonLink = ({size, color, href, isOutlined, children, ...props}) => {
  return (
    <>
      {regex.test(href) ? (
        <a href={href} className={`button${isOutlined ? '-outline' : ''} ${size} ${color}`} {...props}>
          {children}
        </a>
      ) : (
        <Link href={href}>
          <a className={`button${isOutlined ? '-outline' : ''} ${size} ${color}`} {...props}>
            {children}
          </a>
        </Link>
      )}
    </>
  )
}

ButtonLink.propTypes = {
  size: PropTypes.oneOf([
    'small',
    'large'
  ]),
  color: PropTypes.oneOf([
    'primary',
    'warning-light',
    'warning',
    'secondary'
  ]),
  href: PropTypes.string.isRequired,
  isOutlined: PropTypes.bool,
  children: PropTypes.node
}

ButtonLink.defaultProps = {
  size: null,
  color: 'primary',
  isOutlined: false,
  children: null
}

export default ButtonLink
