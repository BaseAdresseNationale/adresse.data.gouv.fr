/* eslint react/jsx-no-target-blank: off */
import PropTypes from 'prop-types'
import Link from 'next/link'

import colors from '@/styles/colors'

function ButtonLink({size, color, href, isDisabled, isOutlined, isExternal, children, ...props}) {
  if (isDisabled) {
    return (
      <>
        <a alt='nopnop' className={`button ${size} secondary`} {...props}>
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

  return (
    isExternal ? (
      <a href={href} className={`button${isOutlined ? '-outline' : ''} ${size} ${color}`} {...props}>
        {children}
      </a>
    ) : (
      <Link href={href}>
        <a className={`button${isOutlined ? '-outline' : ''} ${size} ${color}`} {...props} >
          {children}
        </a>
      </Link>
    )
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
  isDisabled: PropTypes.bool,
  children: PropTypes.node
}

ButtonLink.defaultProps = {
  size: null,
  color: 'primary',
  isOutlined: false,
  isExternal: false,
  isDisabled: false,
  children: null
}

export default ButtonLink
