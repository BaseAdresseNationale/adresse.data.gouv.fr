import {useRef, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'
import {XSquare} from 'react-feather'

import theme from '@/styles/theme'

import MairieContact from '@/components/search-commune-contact/mairie-contact'

function ContactModal({mairieInfos, onModalClose}) {
  const ref = useRef()
  const {nom, horaires, email, telephone} = mairieInfos

  const handleOutsideClose = useCallback(e => {
    if (ref.current && !ref.current.contains(e.target)) {
      onModalClose()
    }
  }, [onModalClose])

  useEffect(() => {
    document.addEventListener('click', handleOutsideClose)

    return () => {
      document.removeEventListener('click', handleOutsideClose)
    }
  }, [handleOutsideClose])

  return (
    <div className='modal-wrapper'>
      <div className='contacts-container' ref={ref}>
        <button className='close-modal' type='button' onClick={onModalClose}><XSquare /></button>
        <MairieContact nom={nom} horaires={horaires} email={email} telephone={telephone} />
      </div>

      <style jsx>{`
        .modal-wrapper {
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
        }

        .contacts-container {
          padding: 1em;
          width: 90%;
          color: ${theme.darkText};
          border-radius: ${theme.borderRadius};
          background: ${theme.backgroundGrey};
          display: flex;
          flex-direction: column;
        }

        .close-modal {
          width: fit-content;
          align-self: flex-end;
          border: none;
          background: transparent;
          color: ${theme.primary};
        }
      `}</style>
    </div>
  )
}

ContactModal.propTypes = {
  mairieInfos: PropTypes.object.isRequired,
  onModalClose: PropTypes.func.isRequired
}

export default ContactModal
