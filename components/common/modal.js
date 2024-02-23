import PropTypes from 'prop-types'
import styled from 'styled-components'
import {XCircle} from 'react-feather'

const StyledContainer = styled.div`
  height: 100vh;
  position: fixed;
  background: rgb(24, 24, 24, 0.7);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;

  > .modal {
  background: white;
  display: flex;
  padding: 2em;
  border-radius: 5px;
  max-height: 90%;
  max-width: 90%;
  height: fit-content;
  flex-direction: column;
  overflow: auto;
  width: 850px;

  > .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1em;
    text-align: center;

    h3 {
      margin: 0;
    }

    button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      margin: 0;

      &:hover {
        background: none;
      }
    }
  }
}
`
function Modal({title, children, onClose}) {
  return (
    <StyledContainer>
      <div className='modal'>
        <div className='header'>
          <h3>{title}</h3>
          <button type='button' label='Fermer la fenêtre' onClick={onClose}>
            <XCircle />
          </button>
        </div>
        {children}
      </div>
    </StyledContainer>
  )
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
}

export default Modal
