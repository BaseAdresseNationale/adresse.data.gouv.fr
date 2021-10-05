import React from 'react'
import PropTypes from 'prop-types'
import {ChevronUp, ChevronDown} from 'react-feather'
import {kebabCase} from 'lodash'

import theme from '@/styles/theme'

class Question extends React.Component {
  state = {
    open: false
  }

  static defaultProps = {
    slug: null,
    isBold: false
  }

  static propTypes = {
    question: PropTypes.string.isRequired,
    slug: PropTypes.string,
    isBold: PropTypes.bool,
    children: PropTypes.node.isRequired
  }

  toggle = () => {
    this.setState(state => {
      return {
        open: !state.open
      }
    })
  }

  render() {
    const {open} = this.state
    const {question, isBold, children} = this.props
    const slug = this.props.slug || kebabCase(question)

    return (
      <div id={slug}>
        <div
          className={`question-container ${open ? 'is-open' : ''}`}
          onClick={this.toggle}
        >
          <div className='question'>{question}</div>
          <div>{open ? <ChevronUp style={{verticalAlign: 'middle'}} /> : <ChevronDown style={{verticalAlign: 'middle'}} />}</div>
        </div>
        {open && (
          <div className='answer'>{children}</div>
        )}
        <style jsx>{`
          .question-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid ${theme.primary};
            padding: ${isBold ? '1em' : '1.5em'};
            margin: 0.2em;
            border-radius: 3px;
          }

          .question-container.is-open {
            border-bottom: none;
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
          }

          .question-container:hover {
            cursor: pointer;
            background: ${theme.primary};
            color: #fff;
          }

          .question {
            font-size: ${isBold ? '20px' : 'large'};
            font-weight: ${isBold ? '600' : 'initial'};
          }

          .answer {
            padding: 1em;
            border: 1px solid ${theme.primary};
            border-top: none;
            background: ${theme.colors.lighterGrey};
            margin: -0.2em 0.2em 0.2em;
          }
        `}</style>
      </div>
    )
  }
}

export default Question
