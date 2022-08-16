import React from 'react'
import PropTypes from 'prop-types'
import {ChevronUp, ChevronDown} from 'react-feather'
import {kebabCase} from 'lodash'

import theme from '@/styles/theme'

import ActionButtonNeutral from '@/components/action-button-neutral'

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
        <ActionButtonNeutral
          label={`Afficher la réponse à la question : ${question}`}
          onClick={this.toggle}
          isFullSize
        >
          <div className={`question-container ${open ? 'is-open' : ''}`}>
            <div className='question'>{question}</div>
            <div>{open ? (
              <ChevronUp style={{verticalAlign: 'middle'}} alt aria-hidden='true' />
            ) : (
              <ChevronDown style={{verticalAlign: 'middle'}} alt aria-hidden='true' />
            )}
            </div>
          </div>
        </ActionButtonNeutral>

        {open && (
          <div className='answer'>{children}</div>
        )}

        <style jsx>{`
          .question-container {
            color: ${theme.darkText};
            width: 100%;
            background: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: none;
            padding: ${isBold ? '1em' : '1.5em'};
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
            text-align: left;
            font-size: ${isBold ? '18px' : 'large'};
            font-weight: ${isBold ? '800' : 'initial'};
          }

          .answer {
            width: 100%;
            padding: ${isBold ? '1em' : '1.5em'};
            background: ${theme.colors.lighterGrey};
          }
        `}</style>
      </div>
    )
  }
}

export default Question
