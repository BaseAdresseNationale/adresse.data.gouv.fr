/* eslint react/jsx-no-target-blank: off */
import PropTypes from 'prop-types'
import Link from 'next/link'

import colors from '@/styles/colors'

function ButtonLink({size, color, href, label, isDisabled, isOutlined, isExternal, children, ...props}) {
  if (isDisabled) {
    return (
      <>
        <a aria-label={label} className={`button ${size} secondary`} {...props}>
          {children}
        </a>
        <div className='unavailable'>(Temporairement indisponible)</div>

        <style jsx>{`
          a.button:hover {
            background-color: ${colors.darkerGrey};
          }

          .unavailable {
            font-size: small;
            font-style: italic;
          }
        `}</style>
      </>
    )
  }

  const newProps = {'aria-label': label, className: `button ${isOutlined ? 'button-outline' : ''} ${size} ${color}`, ...props}

  return (
    isExternal ?
      <a href={href} {...newProps}>{children}</a> :
      <Link href={href} legacyBehavior><a {...newProps} >{children}</a></Link>
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
    'secondary',
    'white'
  ]),
  href: PropTypes.string.isRequired,
  label: PropTypes.string,
  isOutlined: PropTypes.bool,
  isExternal: PropTypes.bool,
  isDisabled: PropTypes.bool,
  children: PropTypes.node
}

ButtonLink.defaultProps = {
  size: null,
  color: 'primary',
  label: null,
  isOutlined: false,
  isExternal: false,
  isDisabled: false,
  children: null
}

export default ButtonLink
