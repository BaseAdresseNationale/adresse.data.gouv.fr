import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

const ButtonLink = ({size, color, href, outlined, children, ...props}) => {
  return (
    <Link href={href}>
      <a className={`button${outlined ? '-outline' : ''} ${size} ${color}`} {...props}>
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
  outlined: PropTypes.bool,
  children: PropTypes.node
}

ButtonLink.defaultProps = {
  size: null,
  color: 'primary',
  outlined: false,
  children: null
}

export default ButtonLink
