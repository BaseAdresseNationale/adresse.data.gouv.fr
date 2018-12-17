import React from 'react'
import PropTypes from 'prop-types'
import FaPencil from 'react-icons/lib/fa/pencil'
import FaClose from 'react-icons/lib/fa/close'

import theme from '../../../../../../styles/theme'

import Button from '../../../../../button'

import Item from '../../item'

class EditVoie extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    toggleForm: PropTypes.func.isRequired,
    children: PropTypes.node
  }

  static defaultProps = {
    children: null
  }

  render() {
    const {item, toggleForm, children} = this.props

    return (
      <div>
        <div>
          <div className='editable-item'>
            <Item {...item} />

            <div className='edit-button'>
              <Button size='small' onClick={toggleForm}>
                {children ? <FaClose /> : <FaPencil />}
              </Button>
            </div>
          </div>
        </div>

        {children && (
          <div className='form'>{children}</div>
        )}

        <style jsx>{`
          .editable-item {
            display: flex;
            align-items: center;
          }

          .edit-button {
            margin: 0.5em;
          }

          .form {
            margin: -58px 0 0.2em;
            padding: 1em;
            padding-top: 70px;
            border: 1px solid ${theme.border};
            box-shadow: 0 1px 4px 0 ${theme.boxShadow};
          }
        `}</style>
      </div>
    )
  }
}

export default EditVoie
