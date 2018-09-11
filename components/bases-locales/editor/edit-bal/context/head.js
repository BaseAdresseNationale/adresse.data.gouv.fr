import React from 'react'
import PropTypes from 'prop-types'
import FaAngleLeft from 'react-icons/lib/fa/angle-left'
import FaPlus from 'react-icons/lib/fa/plus'
import FaClose from 'react-icons/lib/fa/close'

import theme from '../../../../../styles/theme'

import Button from '../../../../button'

class Head extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    previous: PropTypes.func.isRequired,
    toggleForm: PropTypes.func,
    parent: PropTypes.string,
    children: PropTypes.node
  }

  static defaultProps = {
    parent: null,
    toggleForm: null,
    children: null
  }

  render() {
    const {name, parent, previous, toggleForm, children} = this.props

    return (
      <div>
        <div className='context-head shadow-box'>
          <div className='title'>
            <Button size='small' onClick={previous}>
              <FaAngleLeft /> {parent}
            </Button>

            <h2>{name}</h2>
          </div>

          {toggleForm && (
            <Button onClick={toggleForm}>
              {children ? (
                <FaClose />
              ) : (
                <div>
                  <FaPlus />
                </div>
              )}
            </Button>
          )}
        </div>

        {children && (
          <div className='form'>
            {children}
          </div>
        )}

        <style jsx>{`
          .context-head {
            display: flex;
            justify-content: space-between;
            align-items: content;
            margin: 1em 0;
          }

          .shadow-box {
            border: 1px solid ${theme.border};
            box-shadow: 0 1px 4px 0 ${theme.boxShadow};
            padding: 1em;
          }

          .title {
            display: flex;
            align-items: center;
            flex: 1;
          }

          h2 {
            margin: 0 1em;
            flex: 1;
          }

          .form {
            margin-top: -1em;
          }
        `}</style>
      </div>
    )
  }
}

export default Head
