import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

function ButtonLink({size, color, href, isOutlined, isExternal, children, ...props}) {
  return isExternal ? (
    <a href={href} className={`button${isOutlined ? '-outline' : ''} ${size} ${color}`} {...props}>
      {children}
    </a>
  ) : (
    <Link href={href}>
      <a className={`button${isOutlined ? '-outline' : ''} ${size} ${color}`} {...props}>
        {children}
      </a>
    </Link>
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
  isExternal: PropTypes.bool,
  children: PropTypes.node
}

ButtonLink.defaultProps = {
  size: null,
  color: 'primary',
  isOutlined: false,
  isExternal: false,
  children: null
}

export default ButtonLink
