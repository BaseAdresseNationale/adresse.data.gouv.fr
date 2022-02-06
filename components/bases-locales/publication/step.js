import React from 'react'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

class Step extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    validTitle: PropTypes.string.isRequired,
    isActif: PropTypes.bool.isRequired,
    isValid: PropTypes.bool,
    isDisabled: PropTypes.bool
  }

  static defaultProps = {
    isValid: false,
    isDisabled: false
  }

  render() {
    const {index, title, validTitle, isActif, isValid, isDisabled} = this.props
    return (
      <div className='step'>
        {isValid ? (
          <div className='badge valid'>✓</div>
        ) : (
          <div className='badge index'>{index}</div>
        )}

        <div className={`title ${isActif ? 'actif-title' : ''}`}>
          {isValid ? validTitle : title}
        </div>

        <style jsx>{`
          .step {
            flex: 1;
            display: flex;
            align-items: center;
            opacity: ${isDisabled ? 0.5 : 1};
          }

          .badge {
            display: flex;
            width: 1.1em;
            height: 1.1em;
            padding: 1em;
            align-items: center;
            justify-content: center;
            border-radius: 100%;
            margin: 0 1em 0 2em;
          }

          .index {
            background: ${theme.primary};
            color: ${theme.colors.white};
            font-weight: bold;
          }

          .valid {
            background: ${theme.colors.whiteBlue};
            color: ${theme.colors.primary};
          }

          .title {
            border: 1px solid ${theme.border};
            border-radius: 5px;
            text-align: center;
            width: 100%;
            min-height: 85px;
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .actif-title {
            font-weight: bold;
            background: ${theme.primary};
            color: ${theme.colors.white};
          }

        @media (max-width: ${theme.breakPoints.laptop}) {
          .title {
            width: 100%;
            min-height: 100%;
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
