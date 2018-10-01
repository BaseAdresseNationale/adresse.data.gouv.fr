import React from 'react'
import PropTypes from 'prop-types'
import FaPlus from 'react-icons/lib/fa/plus'
import FaClose from 'react-icons/lib/fa/close'

import theme from '../../../../styles/theme'

import Button from '../../../button'

class CreateItemWrapper extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
    toggleForm: PropTypes.func.isRequired,
    displayForm: PropTypes.bool,
    children: PropTypes.node
  }

  static defaultProps = {
    displayForm: false,
    children: null
  }

  render() {
    const {title, buttonText, displayForm, toggleForm, children} = this.props

    return (
      <div className='context-head'>
        {displayForm ? (
          <div className='form'>
            <div className='close'>
              <h4>{title}</h4>
              <Button
                color='red'
                size='small'
                onClick={toggleForm}
              >
                <FaClose />
              </Button>
            </div>

            {children}
          </div>
        ) : (
          <div className='create' onClick={toggleForm}>
            {buttonText} <span><FaPlus /></span>
          </div>
        )}

        <style jsx>{`
          .title {
            display: flex;
            align-items: center;
          }

          h4 {
            flex: 1;
          }

          .divider {
            width: 100%;
            border-bottom: 1px solid ${theme.border};
            padding-bottom: 0.5em;
            margin-bottom: 0.5em;
          }

          .create {
            margin: 0.5em 0 0 0;
            padding: 1.5em;
            display: flex;
            text-align: center;
            color: ${theme.primary};
            border: 1px dashed ${theme.primary};
            background-color: ${theme.primary}0a;
          }

          .create:hover {
            cursor: pointer;
            background-color: ${theme.primary};
            color: ${theme.colors.white};
            border: 1px solid ${theme.colors.white};
          }

          .create > div {
            display: flex;
            align-items: center;
          }

          .form {
            border: 2px dashed ${theme.border};
            padding: 1em;
            margin: 0.5em 0;
          }

          span {
            margin-left: 0.5em;
          }

          .close {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        `}</style>
      </div>
    )
  }
}

export default CreateItemWrapper
