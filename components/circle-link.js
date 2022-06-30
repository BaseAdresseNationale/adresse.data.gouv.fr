import Link from 'next/link'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

function CircleLink({size, href, isExternal, icon, label, fontSize, isImportant, isDisable, children}) {
  return (
    <>
      {isExternal ? (
        <a href={href} className={isDisable ? 'disable' : ''} aria-label={label || children}>
          <div className='circle'>
            {icon}
          </div>
          {children}
        </a>
      ) : (
        <Link href={href}>
          <a className={isDisable ? 'disable' : ''} aria-label={label || children}>
            <div className='circle'>
              {icon}
            </div>
            {children}
          </a>
        </Link>
      )}

      <style jsx>{`
        .circle {
          background: ${theme.primary};
          color: ${theme.colors.white};
          border-radius: 50%;
          width: ${size}px;
          height: ${size}px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          text-transform: ${isImportant ? 'uppercase' : 'none'};
          text-decoration: ${isImportant ? 'none' : 'underline'};
          font-weight: 700;
          color: ${theme.darkText};
          gap: 10px;
          height: fit-content;
          padding: 1em;
          font-size: ${fontSize};
        }

        a.button:hover {
          background-color: ${theme.colors.darkerGrey};
        }

        .disable {
          opacity: 50%;
          color: ${theme.colors.lightGrey};
          pointer-events: none;
        }
      `}</style>
    </>

  )
}

CircleLink.propTypes = {
  size: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  label: PropTypes.string,
  fontSize: PropTypes.string,
  children: PropTypes.node,
  isExternal: PropTypes.bool,
  isDisable: PropTypes.bool,
  isImportant: PropTypes.bool,
}

CircleLink.defaultProps = {
  fontSize: '1em',
  children: null,
  isExternal: false,
  isDisable: false,
  isImportant: false,
  label: null
}

export default CircleLink
