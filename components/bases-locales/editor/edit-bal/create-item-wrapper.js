import React from 'react'
import PropTypes from 'prop-types'
import FaPlus from 'react-icons/lib/fa/plus'
import FaClose from 'react-icons/lib/fa/close'

import theme from '../../../../styles/theme'

import Button from '../../../button'

class CreateItemWrapper extends React.Component {
  static propTypes = {
    listName: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
    toggleForm: PropTypes.func.isRequired,
    children: PropTypes.node
  }

  static defaultProps = {
    children: null
  }

  render() {
    const {listName, buttonText, toggleForm, children} = this.props

    return (
      <div className='context-head'>
        <div className='shadow-box'>
          <div className='title'>
            <h3>{listName}</h3>
            {children ? (
              <Button
                color='red'
                size='small'
                onClick={toggleForm}
              >
                <FaClose />
              </Button>
            ) : (
              <Button onClick={toggleForm}>
                {buttonText} <FaPlus />
              </Button>
            )}
          </div>
        </div>

        <div className='divider' />

        {children && (
          <div className='form'>
            {children}
          </div>
        )}

        <style jsx>{`
          .title {
            display: flex;
            align-items: center;
          }

          h3 {
            flex: 1;
          }

          .divider {
            width: 100%;
            border-bottom: 1px solid ${theme.border};
            padding-bottom: 0.5em;
            margin-bottom: 0.5em;
          }

          .form {
            border: 2px dashed ${theme.border};
            padding: 1em;
          }
        `}</style>
      </div>
    )
  }
}

export default CreateItemWrapper
