import PropTypes from 'prop-types'

import {StyledForm} from '../signalement.styles'
import Input from '@codegouvfr/react-dsfr/Input'
import Button from '@codegouvfr/react-dsfr/Button'
import {getExistingLocationLabel} from '../use-signalement'

export default function SignalementNumeroDeleteForm({onEditSignalement, onClose, address, onSubmit}) {
  return (
    <StyledForm onSubmit={onSubmit}>
      <h4>
        Demande de suppression d&apos;un numéro
      </h4>
      <section>
        <h5>
          Adresse concernée
        </h5>
        <div className='form-row'>
          {getExistingLocationLabel(address)}
        </div>
        <div className='form-row'>
          {address.codePostal} {address.commune.nom}
        </div>
      </section>
      <section>
        <div className='form-row'>
          <Input
            label='Raisons de la suppression*'
            textArea
            onChange={event => onEditSignalement('changesRequested', 'comment')(event.target.value)}
            nativeInputProps={{
              required: true,
            }}
          />
        </div>

      </section>
      <div className='form-controls'>
        <Button
          style={{color: 'white'}}
          type='submit'
        >
          Envoyer le signalement
        </Button>
        <Button type='button' priority='secondary' onClick={onClose}>
          Annuler
        </Button>
      </div>
    </StyledForm>
  )
}

SignalementNumeroDeleteForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  address: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    codePostal: PropTypes.string,
    commune: PropTypes.object,
    position: PropTypes.object,
    positions: PropTypes.array,
    positionType: PropTypes.string,
    parcelles: PropTypes.array,
    displayBBox: PropTypes.array,
    lat: PropTypes.number,
    lon: PropTypes.number,
    voie: PropTypes.object
  }).isRequired,
  onEditSignalement: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}