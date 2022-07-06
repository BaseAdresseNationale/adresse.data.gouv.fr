import PropTypes from 'prop-types'
import theme from '@/styles/theme'

function Step({title, children}) {
  return (
    <div style={{margin: '1em 0'}}>
      <h2 className={`${children ? '' : 'disabled'}`} aria-disabled={!children}>{title}</h2>
      {children}
      <style jsx>{`
        .disabled {
          color: ${theme.colors.grey};
        }
      `}</style>
    </div>
  )
}

Step.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node
}

Step.defaultProps = {
  children: null
}

export default Step
