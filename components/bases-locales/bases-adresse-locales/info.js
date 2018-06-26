import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../styles/theme'

class Info extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    type: PropTypes.oneOf([
      'valid', 'invalid'
    ])
  }

  static defaultProps = {
    type: null
  }

  render() {
    const {title, type, children} = this.props

    return (
      <div className='info'>
        <b>{title} : </b>
        <span className={type}>{children}</span>
        <style jsx>{`
          .info {
            margin 0.5em 0;
          }

          span {
            display: inline-flex;
            border-radius: 3.75em;
            background-color: ${theme.infoBg};
            color: ${theme.infoBorder};
            font-size: .75em;
            line-height: 1;
            padding: .4em 1.2em;
            margin: .1em .5em
          }

          span.valid {
            padding: .4em .5em;
            background-color: ${theme.successBg};
            color: ${theme.successBorder};
          }

          span.invalid {
            padding: .4em .5em;
            background-color: ${theme.errorBg};
            color: ${theme.errorBorder};
          }
          `}</style>
      </div>

    )
  }
}

export default Info
