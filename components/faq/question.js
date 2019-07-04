import React from 'react'
import PropTypes from 'prop-types'
import FaAngleDown from 'react-icons/lib/fa/angle-down'
import FaAngleUp from 'react-icons/lib/fa/angle-up'

import theme from '../../styles/theme'

class Question extends React.Component {
  state = {
    open: false
  }

  static propTypes = {
    question: PropTypes.string.isRequired,
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
    const {question, children} = this.props

    return (
      <div>
        <div
          className={`question-container ${open ? 'is-open' : ''}`}
          onClick={this.toggle}
        >
          <div className='question'>{question}</div>
          <div>{open ? <FaAngleUp /> : <FaAngleDown />}</div>
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
            padding: 1em;
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
            font-size: large;
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
