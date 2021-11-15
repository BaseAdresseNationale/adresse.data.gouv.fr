import PropTypes from 'prop-types'
import theme from '@/styles/theme'

function SectionText({color, children}) {
  return (
    <div className='text-container'>
      {children}

      <style jsx>{`
        .text-container {
          text-align: left;
          font-size: 1em;
          line-height: 1.5em;
          padding-left: 1em;
          color: ${color === 'primary' ? theme.darkText : theme.colors.white};
          border-left: 3px solid ${color === 'primary' ? theme.primary : theme.colors.white};
        }
      `}</style>
    </div>
  )
}

SectionText.propTypes = {
  color: PropTypes.oneOf([
    'primary',
    'secondary',
  ]),
  children: PropTypes.node.isRequired,
}

SectionText.defaultProps = {
  color: 'primary',
}

export default SectionText
