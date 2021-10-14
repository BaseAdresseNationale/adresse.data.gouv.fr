import React from 'react'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

class Step extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    validTitle: PropTypes.string.isRequired,
    isValid: PropTypes.bool,
    isDisabled: PropTypes.bool
  }

  static defaultProps = {
    isValid: false,
    isDisabled: false
  }

  render() {
    const {index, title, validTitle, isValid, isDisabled} = this.props
    return (
      <div className='step'>
        {isValid ? (
          <div className='badge valid'>✓</div>
        ) : (
          <div className='badge index'>{index}</div>
        )}

        <div className='title'>
          {isValid ? validTitle : title}
        </div>

        <style jsx>{`
          .step {
            display: flex;
            align-items: center;
            opacity: ${isDisabled ? 0.5 : 1};
          }

          .badge {
            display: flex;
            width: 1em;
            height: 1em;
            padding: 1em;
            align-items: center;
            justify-content: center;
            border-radius: 100%;
            margin: 0 1em 0 2em;
          }

          .index {
            background: ${theme.colors.almostBlack};
            color: ${theme.colors.white};
          }

          .valid {
            background: ${theme.successBg};
            color: ${theme.successBorder};
          }

          .title {
            border: 1px solid ${theme.border};
            padding: 1em;
            text-align: center;
          }

        @media (max-width: ${theme.breakPoints.laptop}) {
          .title {
            width: 100%;
          }

          .badge {
            margin: 0 1em 0 0;
          }
        `}</style>
      </div>
    )
  }
}

export default Step
