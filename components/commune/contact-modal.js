import PropTypes from 'prop-types'
import {XSquare} from 'react-feather'

import theme from '@/styles/theme'

import MairieCard from '@/components/mairie/mairie-card'
import ActionButtonNeutral from '@/components/action-button-neutral'

function ContactModal({mairieInfos, onModalClose}) {
  const {nom, horaires, email, telephone} = mairieInfos

  return (
    <div className='modal-wrapper'>
      <div className='contacts-container'>
        <div className='close-modal'>
          <ActionButtonNeutral label='Fermer la fenêtre de contact' onClick={onModalClose}>
            <XSquare alt='' aria-hidden='true' color={theme.primary} />
          </ActionButtonNeutral>
        </div>

        <MairieCard nom={nom} horaires={horaires} email={email} telephone={telephone} />
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
          width: 100%;
          text-align: end;
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
