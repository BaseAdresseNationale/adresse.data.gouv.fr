import React from 'react'
import PropTypes from 'prop-types'
import FaPlus from 'react-icons/lib/fa/plus'
import FaClose from 'react-icons/lib/fa/close'

import theme from '../../../../../../styles/theme'

import Button from '../../../../../button'

class CreateNumeroWrapper extends React.Component {
  static propTypes = {
    toggleForm: PropTypes.func.isRequired,
    children: PropTypes.node
  }

  static defaultProps = {
    children: null
  }

  render() {
    const {toggleForm, children} = this.props

    return (
      <div className='context-head'>
        <div className='shadow-box'>
          <div className='title'>
            <h3>Liste des numéros</h3>
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
                Ajouter un numéro <FaPlus />
              </Button>
            )}
          </div>
        </div>

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

          .shadow-box {
            border: 1px solid ${theme.border};
            box-shadow: 0 1px 4px 0 ${theme.boxShadow};
            padding: 0 1em;
            margin: 1em 0;
          }

          h3 {
            flex: 1;
          }

          .form {
            margin: -81px 0 0.2em;
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

export default CreateNumeroWrapper
