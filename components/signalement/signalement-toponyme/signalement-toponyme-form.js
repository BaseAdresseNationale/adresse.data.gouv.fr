import PropTypes from 'prop-types'

import {StyledForm} from '../signalement.styles'
import Input from '@codegouvfr/react-dsfr/Input'
import Button from '@codegouvfr/react-dsfr/Button'
import {getExistingLocationLabel} from '../use-signalement'

export default function SignalementToponymeForm({signalement, onEditSignalement, onClose, address, onSubmit}) {
  const {nom} = signalement.changesRequested

  return (
    <StyledForm onSubmit={onSubmit}>
      <h4>
        Signalement d&apos;un problème d&apos;adressage
      </h4>
      <section>
        <h5>
          Lieu concernée
        </h5>
        <div className='form-row'>
          {getExistingLocationLabel(address)}
        </div>
        <div className='form-row'>
          {address.commune.nom}
        </div>
      </section>
      <section>
        <h5>
          Modifications demandées
        </h5>
        <div className='form-row'>
          <Input
            label='Nom'
            nativeInputProps={{
              required: true,
              value: nom,
              onChange: event => onEditSignalement('changesRequested', 'nom')(event.target.value)}}
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

SignalementToponymeForm.propTypes = {
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
  }),
  signalement: PropTypes.object.isRequired,
  onEditSignalement: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}
