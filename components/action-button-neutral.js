import PropTypes from 'prop-types'

import colors from '@/styles/colors'

function ActionButtonNeutral({children, label, type, isFullSize, ...props}) {
  return (
    <button type={type === 'button' ? 'button' : 'submit'} aria-label={label} {...props}>
      {children}

      <style jsx>{`
        button {
          width: ${isFullSize ? '100%' : 'fit-content'};
          height: fit-content;
          border: none;
          background: none;
          padding: 0;
          margin: 0;
          cursor: pointer;
          color: ${colors.almostBlack};
        }

        button:disabled {
          opacity: 50%;
          cursor: not-allowed;
        }
      `}</style>
    </button>
  )
}

ActionButtonNeutral.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  isFullSize: PropTypes.bool,
  type: PropTypes.oneOf([
    'button',
    'submit'
  ])
}

ActionButtonNeutral.defaultProps = {
  isFullSize: false,
  type: 'button'
}

export default ActionButtonNeutral
